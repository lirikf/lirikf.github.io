//let width = 1600,height=1200;
let width = window.innerWidth, height = window.innerHeight, minDistance = 100,circleRadius=2.5;

let stage = new PIXI.Container();
let autoResolution = width/height
let renderer = PIXI.autoDetectRenderer({
    'width':width,
    'height':height,
});
let loader = PIXI.Loader.shared;

loader.load(setup);
document.body.appendChild(renderer.view);
document.getElementById('generateMap').addEventListener('click',renderGraph);
function setup(){
    renderGraph();
}
function renderGraph(){
    while(stage.children.length > 0){
        stage.removeChild(stage.children[0]);
    }
    let graph = generateRandomGraph(20,22);
    let simulation = d3.forceSimulation()
        .force('link',d3.forceLink().id((d)=>d.id)) //pushed nodes fix distance apart
        .force('charge',d3.forceManyBody().strength(20))  // attract / repel nodes
        .force('center',d3.forceCenter(width/2,height/2)) // centers all nodes around point
        .force('collision',d3.forceCollide().radius(d=>{ // min distance between nodes
            return minDistance;
        }));
    let links = new PIXI.Graphics();
    stage.addChild(links);
    graph.nodes.forEach(node=>{
        node.gfx = new PIXI.Graphics(); // node as Circle
        node.gfx.lineStyle(1.5,0xFFFFFF);
        node.gfx.beginFill(node.group); // circle color
        node.gfx.drawCircle(0,0,circleRadius);

        stage.addChild(node.gfx);
    });
    d3.select(renderer.view)
        .call(d3.drag()
            .container(renderer.view)
            .subject(()=>simulation.find(d3.event.x,d3.event.y))
            .on('start',dragstarted)
            .on('drag',dragged)
            .on('end',dragended));

    simulation.nodes(graph.nodes)
        .on('tick',ticked);

    simulation.force('link')
        .links(graph.links);

    function ticked(){
        graph.nodes.forEach(node=>{
            let {x,y,gfx} = node;
            gfx.position = new PIXI.Point(x,y);
        });
        links.clear();
        links.alpha = 0.6;

        graph.links.forEach(link=>{
            let {source,target} = link;
            links.lineStyle(Math.sqrt(link.value),0x999999);
            links.moveTo(source.x,source.y);
            links.lineTo(target.x,target.y);
        });
        links.endFill();
        renderer.render(stage);
    }

    function dragstarted(){
        if(!d3.event.active) simulation.alphaTarget(0.3).restart();
        d3.event.subject.fx = d3.event.subject.x;
        d3.event.subject.fy = d3.event.subject.y;
    }

    function dragged(){
        d3.event.subject.fx = d3.event.x;
        d3.event.subject.fy = d3.event.y;
    }

    function dragended(){
        if(!d3.event.active) simulation.alphaTarget(0);
        d3.event.subject.fx = null;
        d3.event.subject.fy = null;
    }
}




