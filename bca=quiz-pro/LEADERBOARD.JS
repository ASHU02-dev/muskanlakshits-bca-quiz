window.onload = function(){

let board = JSON.parse(localStorage.getItem("leaderboard") || "[]");

if(board.length === 0){
    document.getElementById("board").innerHTML = "<li>No data yet</li>";
    return;
}

board.sort((a,b)=>b.score-a.score);
let topBoard = board.slice(0,5);

let names = [];
let scores = [];

let ul = document.getElementById("board");
ul.innerHTML = "";

topBoard.forEach(b=>{
    let li = document.createElement("li");
    li.innerText = b.name + " : " + b.score;
    ul.appendChild(li);

    names.push(b.name);
    scores.push(b.score);
});

// chart
const ctx = document.getElementById("leaderboardChart");

new Chart(ctx, {
    type: 'bar',
    data: {
        labels: names,
        datasets: [{
            label: 'Scores',
            data: scores
        }]
    },
    options: {
        responsive: true
    }
});

}