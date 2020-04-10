import React, { Component } from 'react'
import { connect } from 'react-redux';
import Script from 'react-load-script'


import ActionBar from './ActionBar'
import LoadPhotoBox from './LoadPhotoBox';
import Slider from './Slider'

import {updatePoints} from '../../store/actions/canvasActions'
import {updateResults} from '../../store/actions/canvasActions'
import mod from 'react-swipeable-views-core/lib/mod';

var Matrix = require("transformation-matrix-js").Matrix;

export let m


class Canvas extends Component {

    state = {
        ctx : null,
        canvasWidth: 600,
        canvasHeight: 800,
        myImg : null,
        points: [],
        theta: 0,
        baseId: 0,
        mode: 'moving',
        canvasOffset: {
            x: 0,
            y: 0
        },
        lastClick: {
            x: 0,
            y: 0
        },
        selectedPoint: null,
        selectedPointName: null,
        pointisMoved: false,
        movingEnded: false,
        previousOffset: {
            x: 0,
            y: 0
        },
        imageLoaded: false,
        scriptLoaded: false
    }

    handleScriptLoad = () => {
        //this.setState({ scriptLoaded: true })
    }

    handleOpenCVLoad = () => {
        this.setState({ scriptLoaded: true })
    }

    handleFileSelected = (event, file, number) => {

        //this.setState({ [number > 0 ? 'suppFileIcon' : 'mainFileIcon']: 'file-image' })
        let image = new Image()
        image.src = event.target.result
        //console.log(image.height);
        //console.log(file);
        const fileUrl = window.URL.createObjectURL(file)
        image.onload = () => {
            this.props.updatePoints([]);
            //const ratio = image.naturalWidth / image.naturalHeight
            //this.props.onImageLoad(file.name, fileUrl, ratio, number)
            this.setState({ loading: false, imageLoaded: true, theta: 0 }, () =>{

                const canvas = this.refs.canvas
                const newCanvas = this.refs.newCanvas
                const ctx = canvas.getContext("2d")
                //const myImg = new Image()
                //myImg.src = img;
                image.setAttribute('crossOrigin', 'anonymous');
                
                const naturalImageWidth = image.width;
                const naturalImageHeight = image.height;


                let ratio =  image.width / image.height;
                console.log(image.height);
                image.height = this.state.canvasHeight - 100;
                image.width = image.height * ratio;
                console.log(image.height);

                
                

                let offsetX = (canvas.width - image.width) /2;
                let offsetY = (canvas.height - image.height) /2
                
                this.setState({
                    canvas : canvas,
                    ctx : ctx, 
                    myImg : image,
                    fileName: file.name,
                    newCanvas: newCanvas,
                    imageLoaded: true,
                    imageXRatio: naturalImageWidth/ image.width,
                    imageYRatio: naturalImageHeight/ image.height,
                    canvasOffsetXInit: offsetX,
                    canvasOffsetYInit: offsetY
                }, () => {
                    ctx.fillStyle = 'grey';
                    ctx.fillRect(0,0,canvas.width, canvas.height);
                    ctx.drawImage(image, offsetX, offsetY, image.width, image.height)
                    //ctx.drawImage(myImg, 0, 0)
                    ctx.font = "40px Courier"
                    m = new Matrix(this.state.ctx);
                    //ctx.fillText("Test", 50, 50)
                    //ctx.fillText("Test!", 50, 150)
                    console.log(this.props)
                    if(this.state.scriptLoaded)
                        this.doThresholding();
                })

                    
                    
            })

        }


    }

    componentDidMount() {

    }

    componentDidUpdate() {
        //console.log(this.props.appState)
    }


  


    ctxMakeBackgroundAngImage = (theta, reset) => {

        const ctx = this.state.ctx;
        
        ctx.clearRect(0, 0, this.state.canvas.width, this.state.canvas.height);
        ctx.fillStyle = 'grey';
        ctx.fillRect(0,0,this.state.canvas.width, this.state.canvas.height);
        
        ctx.save();
        ctx.translate(this.state.canvas.width/2 + this.state.canvasOffset.x, this.state.canvas.height/2 + this.state.canvasOffset.y);
        
        !reset ? (ctx.rotate(this.state.theta + theta)) : (ctx.rotate(0));
        
        ctx.translate(-(this.state.canvas.width/2 + this.state.canvasOffset.x), -(this.state.canvas.height/2 + this.state.canvasOffset.y));

        //ctx.drawImage(this.state.myImg, (this.state.canvas.width + this.state.canvasOffset.x - this.state.myImg.width) /2 , (this.state.canvas.height + this.state.canvasOffset.y - this.state.myImg.height) /2 );    
        ctx.drawImage(this.state.myImg, this.state.canvasOffsetXInit + this.state.canvasOffset.x  , this.state.canvasOffsetYInit + this.state.canvasOffset.y, this.state.myImg.width, this.state.myImg.height);  
        ctx.restore();

    }

    ctxMakePoint = (point) => {
        const ctx = this.state.ctx;

        ctx.fillStyle = "#c82124"; //red
        ctx.beginPath();
        ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke()

        ctx.save()
        ctx.translate(point.x, point.y)
        ctx.fillStyle = 'red';
        ctx.font = "bold " + (Math.max(8,(11+1)/1)) + "px Arial";
        ctx.fillText(point.name, 0+3, 0 -3);
        ctx.restore()
    }

    calculateAndCtxMakeLine = (point1, point2) => {
        const ctx = this.state.ctx;
        
        let outYStart;
        let outYEnd;
        let outXStart;
        let outXEnd;
        
        
        if(point2 != null){
            let deltaX = point1.x - point2.x;
            console.log(deltaX);

            if(deltaX === 0){
                outXStart = point1.x;
                outXEnd = point2.x;
                outYStart = 0
                outYEnd = this.state.canvas.height;
            }else{

                let a = (point1.y - point2.y)/(point1.x - point2.x);
                let b = point1.y - a*point1.x;
                let xmax = this.state.canvas.width
                
                outYStart = b;
                outYEnd = a*xmax + b;
                outXStart = 0;
                outXEnd = xmax;
            }
        }else{
                outXStart = 0;
                outXEnd = this.state.canvas.width;
                outYStart = point1.y;
                outYEnd = point1.y;
        }


        ctx.beginPath();
        ctx.moveTo(outXStart, outYStart);
        ctx.lineTo(outXEnd, outYEnd);
        ctx.stroke();
    }

    

    handleMouseDown = (e) => {

        let mouse = this.getMousePos(this.state.canvas, e);
        mouse = this.toWorld(mouse.x, mouse.y);


        if(this.props.mode === 'addition'){

            let max = false;
            let end = false;
            let points = [];
            let name = [];
            switch(this.props.appState){
                case 'position':
                    points = this.props.positionPoints;
                    points.length > 1 ? (max = true) : (max = false)
                    break;
                case 'tragus':
                    points = this.props.tragusPoints;
                    points.length > 0 ? (max = true) : (max = false)
                    break;
                case 'correction':
                    points = this.props.extremePoints;
                    points.length > 1 ? (max = true) : (max = false)
                    break;
                case 'extreme':
                    end = true;
                    max = true;
                    break;
                default:
                    end = true;
                    max = true;
                
            }

            let pointToMove = false;
            if(!end){
                points.forEach(point => {
                
                    if (point != null) {
                        if(this.isBetween(mouse, point)){
                            this.setState({ selectedPoint: point.id, selectedPointName: point.name,  pointIsMoved: true })
                                
                                pointToMove = true;
                                point.stroke = '#F2C553'
                        }
                    }
                })
            }


            if(!pointToMove){
                if(!max){
                    let point = {id: this.state.baseId + 1, x: mouse.x, y: mouse.y, name: name}
                    
                    let newPoints = [...this.props.points, point];
                    
                    console.log(point);
                    newPoints = this.refreshNames(newPoints);
                    console.log(newPoints[2]);
                    this.ctxMakeBackgroundAngImage(0);
                    newPoints.forEach(point => {
                        if (point != null) {
                            this.ctxMakePoint(point);
                        }
                    })
                    
                    this.setState({
                        //points: [point, ...this.state.points],
                        baseId: this.state.baseId + 1
                    }, () => {
                        this.drawLines(newPoints);
                        this.props.updatePoints(newPoints)
                    })
                }
            }else{
                this.activateMove(e)
            }
        
            
        }else if(this.props.mode === 'moving'){
            this.activateMove(e)
        }
    }


    deleteLinesAndRefresh = () => {
        this.ctxMakeBackgroundAngImage(0);

        this.props.points.forEach(point => {
            if (point != null) {
                this.ctxMakePoint(point);
            }
        })
    }

    deletePoint = (id) => {
        
        this.ctxMakeBackgroundAngImage(0);

        let pointList = this.props.points.filter((point) => {
            return point.id !== id;
        })

        pointList = this.refreshNames(pointList);

        pointList.forEach(point => {
            if (point != null) {
                this.ctxMakePoint(point);
            }
        })

        
        
        //this.setState({
            //points: pointList
        //}, () => {
        this.props.updatePoints(pointList);
        //})

    }


    handleRotate = () => {
        const lastTwoPoints = this.props.positionPoints;
        //console.log(lastTwoPoints); //[0] up
        if(lastTwoPoints.length === 2){
            let upPoint = null;
            let downPoint = null;
            
            if(lastTwoPoints[0].y >= lastTwoPoints[1].y){
                upPoint = lastTwoPoints[0];
                downPoint = lastTwoPoints[1];
            }else{
                upPoint = lastTwoPoints[1];
                downPoint = lastTwoPoints[0];
            }

            let theta = Math.atan(Math.abs(upPoint.x - downPoint.x) / Math.abs(upPoint.y - downPoint.y))
            if(upPoint.x < downPoint.x){
                theta = (-1) * theta;
            }
            console.log(theta);

            //rotate only image with theta param

            this.ctxMakeBackgroundAngImage(theta);

           

            let offsetX = this.state.canvasOffset.x 
            let offsetY = this.state.canvasOffset.y 
            
            //rotate points, grab new coor
            m.translate(this.state.canvas.width/2 + offsetX, this.state.canvas.height/2 + offsetY);
            m.rotate(theta);
            m.translate(-(this.state.canvas.width/2 + offsetX),-(this.state.canvas.height/2 + offsetY));


            let translatedPoints = m.applyToArray(this.props.points);
            console.log(translatedPoints);

            m.reset();
            
            
            //rewrite new coords and draw points


            let newPoints = [];
            for(let i=0; i<translatedPoints.length; i++){
                let newPoint = {id: this.props.points[i].id, x: translatedPoints[i].x, y: translatedPoints[i].y, name: this.props.points[i].name};
                newPoints = [newPoint, ...newPoints];

            }

            newPoints = this.refreshNames(newPoints);

            newPoints.forEach(point => {
                if (point != null) {
                    this.ctxMakePoint(point);
                }
            })

            
    
            this.setState({
                //points: newPoints,
                theta: theta + this.state.theta
            },() =>{
                this.props.updatePoints(newPoints);
                this.doThresholding();
            })

        }

    }

    handleCenterRestore = () => {

        this.setState({
            canvasOffset: {
                x: 0,
                y: 0,
            },
            
        }, () => {
            this.ctxMakeBackgroundAngImage(null, true); //reset param true

            let offsetX = this.state.previousOffset.x 
            let offsetY = this.state.previousOffset.y


            //rotate points, grab new coor
            m.translate(this.state.canvas.width/2 + offsetX, this.state.canvas.height/2 + offsetY);
            m.rotate(-this.state.theta);
            m.translate(-(this.state.canvas.width/2 + offsetX),-(this.state.canvas.height/2 + offsetY));


            let translatedPoints = m.applyToArray(this.props.points);
            console.log(translatedPoints);

            m.reset();
            
            //rewrite new coords and draw points


            let newPoints = [];
            for(let i=0; i<translatedPoints.length; i++){
                let newPoint = {id: this.props.points[i].id, x: translatedPoints[i].x - offsetX, y: translatedPoints[i].y - offsetY, name: this.props.points[i].name};
                newPoints = [...newPoints, newPoint];

            }

            newPoints = this.refreshNames(newPoints);

            newPoints.forEach(point => {
                if (point != null) {
                    this.ctxMakePoint(point);
                }
            })

            

            this.setState({
                //points: newPoints,
                theta: 0,
                previousOffset: {
                    x: 0,
                    y: 0,
                },
            }, () => {
                this.props.updatePoints(newPoints)
                    
                this.doThresholding();
                //this.doThresholding();
            })
        })

    }

    activateMove = (e) => {
        let mouse = this.getMousePos(this.state.canvas, e);
        let lastClick = { x: mouse.x - this.state.canvasOffset.x, y: mouse.y - this.state.canvasOffset.y}
        this.setState({ lastClick: lastClick, handleMouseMoveActive: true })

    }

    handleMouseMove = (event) => {


        if (this.state.handleMouseMoveActive) {
            var mouse = this.getMousePos(this.state.canvas, event);
            
            if (this.props.mode === 'addition' && this.state.pointIsMoved) {

                this.ctxMakeBackgroundAngImage(0);
                mouse = this.toWorld(mouse.x, mouse.y);


                let pointList = this.props.points.filter((point) => {
                    return point.id !== this.state.selectedPoint;
                })

        

                let point = {id: this.state.selectedPoint, x: mouse.x, y: mouse.y, name: this.state.selectedPointName}
                pointList = [...pointList, point];

                pointList = this.refreshNames(pointList);

                pointList.forEach(point => {
                    if (point != null) {
                        this.ctxMakePoint(point);
                    }
                })

                this.setState({
                    //points: pointList
                }, () =>{
                    this.props.updatePoints(pointList);
                })
            } else if (this.props.mode === 'moving') {
                var mx = mouse.x - this.state.lastClick.x;
                var my = mouse.y - this.state.lastClick.y;
                let offset = { x: mx, y: my }
                this.setState({ canvasOffset: offset,
                                movingEnded: false}, 
                    () => {
                        this.ctxMakeBackgroundAngImage(0);

                        //rewrite new coords and draw points

                        let offsetX = this.state.canvasOffset.x - this.state.previousOffset.x;
                        let offsetY = this.state.canvasOffset.y - this.state.previousOffset.y
                        let newPoints = [];
                        
                        for(let i=0; i<this.props.points.length; i++){
                            let newPoint = {id: this.props.points[i].id, x: this.props.points[i].x + offsetX, y: this.props.points[i].y + offsetY, name: this.props.points[i].name};
                            newPoints = [...newPoints, newPoint];

                        }

                        newPoints.forEach(point => {
                            if (point != null) {
                                this.ctxMakePoint(point);
                            }
                        })

                        newPoints = this.refreshNames(newPoints);
                        
                        this.setState({
                            movingPoints: newPoints
                        }, () => this.setState({
                            movingEnded: true
                        }))

                    }
                )
            
            }
        }
    }

    handleMouseUp = e => {
        if (this.state.handleMouseMoveActive ) {
            if (this.props.mode === 'moving' && this.state.movingEnded) {
                const newPoints = this.state.movingPoints;
                this.doThresholding();
                this.setState({
                    //points: newPoints,
                    previousOffset: this.state.canvasOffset
                }, () => { 
                    if(this.props.appState === 'correction'){
                        this.drawLines(newPoints);
                    }
                    this.props.updatePoints(newPoints)
                    .then(() => {
                        this.setState({movingPoints: null})})
                    });
                          
            }
            if (this.props.mode === 'addition'){
                if(this.props.appState === 'correction'){
                    this.drawLines();
                }
            }
        
        
        }
        
        this.setState({ handleMouseMoveActive: false, pointIsMoved: false, selectedPoint: null, selectedPointName: null, movingEnded: false})
    }


    doThresholding = () => {
        const newCanvas = this.state.newCanvas
        const ctx = newCanvas.getContext("2d");
        
        ctx.clearRect(0, 0, this.state.canvas.width, this.state.canvas.height);
        ctx.fillStyle = 'white';
        ctx.fillRect(0,0,this.state.canvas.width, this.state.canvas.height);
        
        ctx.save();
        ctx.translate(this.state.canvas.width/2 + this.state.canvasOffset.x, this.state.canvas.height/2 + this.state.canvasOffset.y);
        
        ctx.rotate(this.state.theta);
        
        ctx.translate(-(this.state.canvas.width/2 + this.state.canvasOffset.x), -(this.state.canvas.height/2 + this.state.canvasOffset.y));

    
        ctx.drawImage(this.state.myImg, this.state.canvasOffsetXInit + this.state.canvasOffset.x  , this.state.canvasOffsetYInit + this.state.canvasOffset.y, this.state.myImg.width, this.state.myImg.height);  
        ctx.restore();



        /*const image = new window.MarvinImage();

        
        
        const imageLoaded = () => {
            
            var imageOut = new window.MarvinImage(image.getWidth(), image.getHeight());
            // Edge Detection (Prewitt approach)
            window.Marvin.prewitt(image, imageOut);
            // Invert color
            window.Marvin.invertColors(imageOut, imageOut);
            // Threshold
            window.Marvin.thresholding(imageOut, imageOut, 210);
            imageOut.draw(newCanvas);

          }

        image.load(newCanvas.toDataURL(), imageLoaded); */

        let src = window.cv.imread('newCanvas');
        let dst = window.cv.Mat.zeros(src.rows, src.cols, window.cv.CV_8UC3);
        window.cv.cvtColor(src, src, window.cv.COLOR_RGBA2GRAY, 0);
        window.cv.threshold(src, src, 215, 200, window.cv.THRESH_BINARY);
        let contours = new window.cv.MatVector();
        let contoursExternal = new window.cv.MatVector();
        let hierarchy = new window.cv.Mat();
        let hierarchyExternal = new window.cv.Mat();
        // You can try more different parameters
        window.cv.findContours(src, contoursExternal, hierarchyExternal, window.cv.RETR_EXTERNAL, window.cv.CHAIN_APPROX_SIMPLE);
        window.cv.findContours(src, contours, hierarchy, window.cv.RETR_CCOMP, window.cv.CHAIN_APPROX_SIMPLE);
        // draw contours with random Scalar
        
        console.log("new")
        var avoid = 0;
        var limit = 32;
        for (let i = 0; i < contoursExternal.size(); ++i) {
            
            
            if(contoursExternal.get(i).matSize[0] > limit){
                console.log(contoursExternal.get(i).matSize[0])
                avoid++;
            }
        }
        console.log("Avoid: " + avoid)
        //avoid = 0;
        for (let i = avoid; i < contours.size(); ++i) {
            //console.log(contours.get(i).matSize[0])

            //console.log(contours.get(i))
            if(contours.get(i).matSize[0] > limit){
                console.log(contours.get(i).matSize[0])
                if(avoid === 0){
                    
                    let color = new window.cv.Scalar(Math.round(Math.random() * 255), Math.round(Math.random() * 255),
                                            Math.round(Math.random() * 255));
                    window.cv.drawContours(dst, contours, i, color, 0, window.cv.LINE_8, hierarchy, 100);
                }else{
                    avoid--;
                }
            }
        }

        window.cv.imshow('newCanvas', dst);
        src.delete(); dst.delete(); contours.delete(); hierarchy.delete(); contoursExternal.delete(); hierarchyExternal.delete();
        

        


    }

    handleExtremes = () => {

        const isBlack = (ctx, x, y, down) => {
            
            /*let modX, modY;
            if(down){
                modX = -2;
                modY = -2;
            }else{
                modX = 2;
                modY = 2;
            }

            const matrix = ctx.getImageData(x + modX, y + modY, 10, 10)
            const values = matrix.data;
            let count = 0, all = 0;
            for (let i=0; i<values.length; i++){
                if(mod(i+1, 4) !==0){
                    if(values[i] === 0) {
                        count++;
                    }
                    all++;
                }
            }

            const score = count/all;
            if(score > 0.4){
                console.log('X: ' + x + ' Y: ' + y)
                console.log(score);
            }

            //const rgba = 'rgba(' + data[0] + ', ' + data[1] + ', ' + data[2] + ', ' + (data[3] / 255) + ')';
            return score > 0.5;*/

            const matrix = ctx.getImageData(x, y, 1, 1)
            const data = matrix.data;

            return data[0] !== 0 || data[1] !== 0 || data[2] !== 0 

        }

        if(this.state.imageLoaded && this.state.scriptLoaded){
            const newCanvas = this.state.newCanvas
            const ctx = newCanvas.getContext("2d");

            
            var isBreak = false;
            const tragus = this.props.points[2];
            let posUp, posDown;

            if(this.props.points[0].y < this.props.points[1].y){
                posUp = this.props.points[0];
                posDown = this.props.points[1];
            }else{
                posUp = this.props.points[1];
                posDown = this.props.points[0];
            }

            const maxYUp = posUp.y - Math.abs(posUp.y - posDown.y)

            const maxYDown = posDown.y + Math.abs(posUp.y - posDown.y)

            const modMaxX = tragus.x > posUp.x ? (4) : (-4)
            const maxX = posUp.x + modMaxX*Math.abs(tragus.x - posUp.x);
            console.log(maxX);
            console.log(maxYUp);
            console.log(maxYDown);

            let itMinX, itMaxX
            if(modMaxX > 0){
                itMinX = tragus.x;
                itMaxX = maxX;
            }else{
                itMinX = maxX;
                itMaxX = tragus.x;
            }

            for(var y = maxYUp; y < posUp.y; y+=1){
                //console.log(y)
                for(var x = itMinX; x < itMaxX; x+=1){
                    
                    //pixel = ctx.getImageData(x, y, 1, 1);
                    //const data = pixel.data;
                    
                    //console.log(rgba);
                    if(isBlack(ctx, x, y, false)){
                        
                            this.setState({
                                extremeUp : {
                                    x: x,
                                    y: y,
                                }
                            })
                            console.log(x);
                            console.log(y);
                            isBreak = true;
                            break;
                    }
                }
                if(isBreak)
                    break;
                
            }

            isBreak = false;
            console.log('MaxX:' + maxX);
            console.log('PosUp.x: ' + posUp.x)
            for(var y1 = maxYDown; y1 >= posDown.y; y1-=1){
                //console.log(y1)
                for(var x1 = itMaxX; x1 >= itMinX; x1-=1){
                    
                    if(isBlack(ctx, x1, y1, true)){
                            this.setState({
                                extremeDown : {
                                    x: x1,
                                    y: y1,
                                }
                            })
                            console.log(x1);
                            console.log(y1);
                            isBreak = true;
                            break;
                    }
                }
                if(isBreak)
                    break;
                
            }

            const scale = (Math.abs(tragus.y - y1)/ Math.abs(tragus.y - y))

            const isOk = scale > 0.42 && scale < 0.72 ? ('OK') : ('NOT OK')

            console.log('Scale: ' + scale)
            console.log(isOk)

            let pointUp = {id: this.state.baseId + 1, x: x, y: y, name: 'PE0' }
            let pointDown = {id: this.state.baseId + 2, x: x1, y: y1, name: 'PE1'}
                
            let newPoints = [...this.props.points.slice(0,3), pointDown, pointUp];

            newPoints = this.refreshNames(newPoints);

            this.ctxMakeBackgroundAngImage(0);
            newPoints.forEach(point => {
                if (point != null) {
                    this.ctxMakePoint(point);
                }
            })

            this.setState({
                //points: newPoints,
                baseId: this.state.baseId + 2
            }, () => {
                this.props.updatePoints(newPoints)
                .then(() => {
                    this.drawLines();
                });
                
            })
            
        }

    }

    drawLines = (paramPoints) => {

        const points = paramPoints ? (paramPoints) : this.props.points;
        if(points.length === 5){

            this.calculateAndCtxMakeLine(points[0], points[1]);
            this.calculateAndCtxMakeLine(points[3], points[4]);
            this.calculateAndCtxMakeLine(points[2]);
            this.calculateAndCtxMakeLine(points[3]);
            this.calculateAndCtxMakeLine(points[4]);

        }
    }
    
    refreshNames = (points) => {
        if(points.length === 1){
            points[0].name = "POS_UP"
        }
        if(points.length > 1){
            if(points[1].y > points[0].y) { 
                points[0].name = "POS_UP"
                points[1].name = "POS_DOWN"
            }else{
                points[1].name = "POS_UP"
                points[0].name = "POS_DOWN"
            }
        }

        if(points.length > 2){
            points[2].name = "TR"
        }

        if(points.length === 4){
            points[3].name = "EX_UP"      
        }
        
        if(points.length > 4){
            if(points[4].y > points[3].y) { 
                points[3].name = "EX_UP"
                points[4].name = "EX_DOWN"
            }else{
                points[4].name = "EX_UP"
                points[3].name = "EX_DOWN"
            }
        }        

        
        return points;            
    }


    getMousePos = (canvas, evt) => {
        var rect = canvas.getBoundingClientRect();
        return { x: (evt.clientX - rect.left), y: (evt.clientY - rect.top) };
    }

    toWorld = (x, y) => {
        const im = m.inverse(m)
        let point = { x: x, y: y }
        point = im.applyToPoint(point.x, point.y)
        return point
    }

    isBetween = (mouse, point) => {
        return Math.sqrt((point.x - mouse.x) ** 2 + (point.y - mouse.y) ** 2) < 3 * 1.5;
    }
    

    handleCompute = () => {

        const results = {id: Math.round(Math.random() * 255), name: 'halo ' + Math.round(Math.random() * 255)}
        this.props.updateResults(results);
    }
    
    componentWillReceiveProps(nextProps){
    
        if(this.props.appState === 'position' && nextProps.appState === 'tragus'){ //1st -> 2nd
            this.handleRotate();
        }
        
        if(this.props.appState === 'tragus' && nextProps.appState === 'correction'){ //2nd -> 3rd
            this.handleExtremes();
        }

        if(this.props.appState === 'correction' && nextProps.appState === 'export'){ //3rd -> 4th
            this.handleCompute();
        }

        if(this.props.appState === 'export' && nextProps.appState === 'position'){ //4th -> 1st
            this.setState({imageLoaded: false, theta: 0})
            this.props.updatePoints([]);
            this.props.updateResults([]);
        }

        if(this.props.appState === 'tragus' && nextProps.appState === 'position'){ //2nd -> 1st
            this.props.updatePoints(this.props.points.slice(0,2))
            .then(()=>{
                this.handleCenterRestore();
            })
            
        }

        if(this.props.appState === 'correction' && nextProps.appState === 'tragus'){ //3rd -> 2nd
            this.props.updatePoints(this.props.points.slice(0,3))
            .then(() => {
                this.deleteLinesAndRefresh();
            })
        }

        if(this.props.appState === 'export' && nextProps.appState === 'correction'){ //4th -> 3rd
            this.props.updateResults([]);
        }

    }

    render() {

        const imageLoaded = this.state.imageLoaded;

        const photoLoader = this.props.appState === 'position' ? (
            <LoadPhotoBox
                onLoadStart={() => this.setState({ loading: true,  })}
                onLoad={(event, file) => this.handleFileSelected(event, file, 0)}
                icon={this.state.mainFileIcon}
                fileName={this.state.fileName}
            />
        ) : (
            null
        )

        const actionBar =  imageLoaded && this.props.appState !== 'export' ? (
            <ActionBar />
        ) : (
            null
        )
        const imageContainer = imageLoaded ? (
            <div>    
                <div className="canvases">
                        <canvas id="canvas" ref="canvas" width={this.state.canvasWidth} height={this.state.canvasHeight} onMouseDown={this.handleMouseDown} onMouseUp={this.handleMouseUp} onMouseMove={this.handleMouseMove}/>
                        <canvas id="newCanvas" ref="newCanvas" width={this.state.canvasWidth} height={this.state.canvasHeight}></canvas>
                </div>
            </div>
        ) : (
            <div className = "com" >
                    <div className="card z-depth-0 project-summary">
                        <div className="card-content grey-text text-darken-3">
                            <span className="card-title">Load the sample.</span>
                        </div>
                    </div>
                </div>
        )

        const buttonContainer = imageLoaded ? (
        
                <div className="buttons">
                    <div className="row">
                            <button className="btn pink lighten-1 z-depth-0 right" onClick={this.handleRotate}>Rotate along two last points</button>
                    </div>
                    <div className="row">
                        <button className="btn pink lighten-1 z-depth-0 right" onClick={this.handleExtremes}>Compute extremes</button>
                    </div>
                    <div className="row">
                        <button className="btn pink lighten-1 z-depth-0 right" onClick={this.handleCenterRestore}>Restore to native position</button>
                    </div>
                </div>
        ) : (
            null
        )

        return (
        
        <div className="dashboard container">
            <Script
                url="https://www.marvinj.org/releases/marvinj-0.7.js"
                onLoad={this.handleScriptLoad.bind(this)}
            />
            <Script
                url="https://docs.opencv.org/4.1.0/opencv.js"
                onLoad={this.handleOpenCVLoad.bind(this)}
            />
            <div className="row">
                <div className="col s12 m6">
                    {/*buttonContainer*/}
                    {photoLoader}
                    {actionBar}
                    {imageContainer}
                </div>
                    
                 {/*12 columns on small screnn, 6 colums on medium screen - left half of screen*/}
                <div className="col s12 m5 offset-m1">
                    <Slider 
                        handleExtremes = {this.handleExtremes}
                        deletePoint = {this.deletePoint}
                        handleExport = {this.handleExport}/>
                    
                </div> {/*one column gap*/}
            </div>
        </div>  
        
        )
    }
}





const mapStateToProps = (state) => {
    return {
        appState: state.canvas.appState,
        mode: state.canvas.mode,
        points: state.canvas.points,
        positionPoints: state.canvas.points.slice(0,2),
        tragusPoints: state.canvas.points.slice(2,3),
        extremePoints: state.canvas.points.slice(3,5)
    } 
}

const mapDispatchToProps = (dispatch) => {
    return {
        updatePoints: (points) => dispatch(updatePoints(points)),
        updateResults: (results) => dispatch(updateResults(results))
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Canvas);
