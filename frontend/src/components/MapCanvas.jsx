import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { Stage, Layer, Image as KonvaImage, Line } from "react-konva";


const MapCanvas = forwardRef(({ backgroundUrl, showGrid }, ref) => {
/* --States-- */
    const stageRef = useRef(null);
    const containerRef = useRef(null);
    const [containerSize, setContainerSize] = useState({width: 0, height: 0 });
    const [imgSize, setImgSize] = useState(null);                                           // { width, height } of the loaded map's natural pixels
    const [imgElement, setImgElement] = useState(null);         // HTMLImageElement handed to <KonvaImage>
    
/* --Constants-- */
    const SCALE_BY = 1.05;
    const GRID_SIZE = 50;
    const GRID_COLOR = "rgba(0,0,0,0.6)";

    const handleWheel = (e) =>{
        e.evt.preventDefault();

        const stage = stageRef.current;
        if (!stage) return;

        const oldScale = stage.scaleX();
        const pointer = stage.getPointerPosition();

        const mousePointTo ={
            x: (pointer.x - stage.x()) / oldScale,
            y: (pointer.y - stage.y()) / oldScale,
        };

        const direction = e.evt.deltaY > 0 ? -1 : 1;
        const newScale = direction > 0 ? oldScale * SCALE_BY : oldScale / SCALE_BY;
        const clampedScale = Math.max(minScale, Math.min(maxScale, newScale));

        stage.scale({ x: clampedScale, y: clampedScale });

        stage.position(clampPosition({
            x: pointer.x - mousePointTo.x * clampedScale,
            y: pointer.y - mousePointTo.y * clampedScale,
        }, clampedScale));
    };

    const zoomBy = (factor) =>{
        const stage = stageRef.current;
        if (!stage){
            return;
        }

        const oldScale = stage.scaleX();
        const newScale = Math.max(minScale, Math.min(maxScale, oldScale*factor));

        const center = {
            x: containerSize.width / 2,
            y: containerSize.height /2,
        };

        const centerPointTo = {
            x: (center.x - stage.x()) / oldScale,
            y: (center.y - stage.y()) / oldScale,
        };

        stage.scale({ x: newScale, y: newScale});
        stage.position(clampPosition({
            x: center.x - centerPointTo.x * newScale,
            y: center.y - centerPointTo.y * newScale,
        }, newScale));
    };

    useImperativeHandle(ref, ()=> ({
        zoomIn: () => zoomBy(SCALE_BY),
        zoomOut: () => zoomBy(1 / SCALE_BY),
    }));
    // Compute draw dimensions: scale up small maps to "cover" the viewport,
    // leave maps that are already bigger than the viewport at natural size.
    const scale = imgSize
        ? Math.max( 1, Math.max (
            containerSize.width / imgSize.width,
            containerSize.height / imgSize.height
        )  
    ) :1;
    const drawWidth = imgSize ? imgSize.width * scale : 0;
    const drawHeight = imgSize ? imgSize.height * scale: 0;

    const gridLine = [];
    if(imgSize) {
        for (let x = 0; x <= drawWidth; x += GRID_SIZE){
            gridLine.push({ points:[x, 0, x, drawHeight], key: `v${x}` });
        }
        for(let y = 0; y <= drawHeight; y+= GRID_SIZE){
            gridLine.push({ points:[0, y, drawWidth, y], key: `h${y}` });
        }
    }

    const fitScale = imgSize && containerSize.width > 0 && drawWidth > 0
        ? Math.min(
            containerSize.width /drawWidth,
            containerSize.height / drawHeight
        )
        : 1;
const minScale = Math.min(1, fitScale);
const maxScale = 1;

const clampPosition = (pos, currentScale) => {
    const scaledWidth = drawWidth * currentScale;
    const scaledHeight = drawHeight * currentScale;

    const x = scaledWidth >= containerSize.width
        ? Math.min(0, Math.max(containerSize.width - scaledWidth, pos.x))
        : (containerSize.width - scaledWidth) / 2;
    const y = scaledHeight >= containerSize.height
        ? Math.min(0, Math.max(containerSize.height - scaledHeight, pos.y))
        : (containerSize.height - scaledHeight) / 2;

    return { x, y };
};

    
 /* --Effects-- */
    // Whenever the user picks a new map, load it as an Image and capture
    // both the HTMLImageElement (for Konva) and its natural pixel dimensions.
    useEffect(()=>{
        if (!backgroundUrl){
            setImgSize(null);
            setImgElement(null);
            return;
        }

        const img = new Image();
        img.onload = () => {
            setImgSize({ width: img.naturalWidth, height: img.naturalHeight});
            setImgElement(img);
        };
        img.src = backgroundUrl;
    }, [backgroundUrl]);

    // Keep windowSize state in sync with the browser viewport.
    // Cleanup removes the listener when the component unmounts.
    useEffect(()=>{
        if (!containerRef.current)
            return;

        const observer = new ResizeObserver((entries) =>{
            const {width, height} = entries[0].contentRect;
            setContainerSize({ width, height });
        })

        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    // Center the Stage on the image whenever a new map loads
    useEffect(() => {
        if (imgSize && stageRef.current){
            stageRef.current.scale({ x:1, y: 1 });
            stageRef.current.position({
                x: (containerSize.width - drawWidth) / 2,
                y: (containerSize.height - drawHeight) / 2,
            });
        }
    }, [imgElement]);

    /* --Render-- */
    return(
        <div ref={containerRef} style={{width: "100%", height: "100%"}}>
            {imgElement && (
                <Stage
                    ref={stageRef}
                    width={containerSize.width}
                    height={containerSize.height}
                    draggable
                    onWheel={handleWheel}
                    dragBoundFunc={(pos)=>{
                        const stage = stageRef.current;
                        const currentScale = stage ? stage.scaleX() : 1;
                        return clampPosition(pos, currentScale);

                    }}
                >
                    <Layer>
                        <KonvaImage image={imgElement} width={drawWidth} height ={drawHeight} />
                        {showGrid && gridLine.map(line => (
                            <Line
                                key={line.key}
                                points={line.points}
                                stroke={GRID_COLOR}
                                strokeWidth={2}
                            />
                        ))}
                    </Layer>
                </Stage>
            )}
        </div>
    );  
  
});

export default MapCanvas;