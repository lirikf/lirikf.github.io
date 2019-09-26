
//graph config
let n = 20,m=22,minVal=1,maxVal=10;

let list = generateRandomGraph(n,m);
function generateRandomGraph(n,m){
    let combinations = allCombinations(d3.range(n));
    let links = generateRandomSubset(combinations,m);
    let formattedEdges = links.map( a=>{
        return {
            source:a[0],
            target:a[1],
            value: Math.floor(Math.random() * (maxVal-minVal+1))+minVal
        }
    });
    let formattedNodes = d3.range(n).map( a=>{
        return{
            id:a,
            group: Math.floor(Math.random() * (10-1+1))+1
        }
    });
    let graph = {
        nodes:formattedNodes,
        links:formattedEdges
    }
    return graph;
}

function allCombinations(list){
    let combinations = [];
    for(let i = 0; i < list.length; i++){
        for(let j = i+1; j < list.length; j++){
            combinations.push([list[i],list[j]]);
        }
    }
    return combinations;
}

function generateRandomSubset(list,m){
    let subset = [];
    for(let i = 0; i < m; i++){
        let index = Math.random() * (list.length-1);
        subset.push(list.splice(index,1)[0]);
    }
    return subset;
}





