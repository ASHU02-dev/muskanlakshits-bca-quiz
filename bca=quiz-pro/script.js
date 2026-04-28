document.addEventListener("DOMContentLoaded", function() {
let loggedUser = localStorage.getItem("loggedInUser");

let input = document.getElementById("username");
if(input && loggedUser){
    input.value = loggedUser;
}
    let quizQuestions = [];
    let current = 0;
    let score = 0;
    let timer = 20;
    let interval;

    // Dark mode toggle
    const darkSwitch = document.getElementById("darkSwitch");
    if(darkSwitch){
        darkSwitch.addEventListener("change", () => {
            document.body.classList.toggle("dark-mode");
        });
    }

    // Start Quiz
    window.startQuiz = function(){
      let name = localStorage.getItem("loggedInUser");
        let subject = document.getElementById("subject").value;
        let level = document.getElementById("level").value;
        let count = parseInt(document.getElementById("count").value);

        localStorage.setItem("name", name);
        localStorage.setItem("subject", subject);
        localStorage.setItem("level", level);
        localStorage.setItem("count", count);

        window.location = "quiz.html";
    }

    // Open Leaderboard
    window.openLeaderboard = function(){
        window.location = "leaderboard.html";
    }
    window.logout = function(){
    localStorage.removeItem("loggedInUser");
    window.location.href = "login.html";
}

    // Quiz Page Logic
    if(window.location.pathname.includes("quiz.html")){
        let subject = localStorage.getItem("subject");
        let level = localStorage.getItem("level");
        let count = parseInt(localStorage.getItem("count"));

        if(!questions || !questions[subject] || !questions[subject][level]){
            alert("Questions not found!");
            return;
        }

        quizQuestions = [...questions[subject][level]];

        quizQuestions.sort(() => Math.random() - 0.5);
        quizQuestions = quizQuestions.slice(0, count);

        loadQuestion();
        startTimer();
    }

    // Load Question
    function loadQuestion(){
        let q = quizQuestions[current];

        // Shuffle options
        let options = [...q.options];
        let correctAnswer = q.answer;

        for(let i=options.length-1; i>0; i--){
            let j = Math.floor(Math.random()*(i+1));
            [options[i], options[j]] = [options[j], options[i]];
            if(i === correctAnswer) correctAnswer = j;
            else if(j === correctAnswer) correctAnswer = i;
        }
        q.shuffledAnswer = correctAnswer;

        document.getElementById("question").innerText = q.question;
        let optionsContainer = document.getElementById("options");
        optionsContainer.innerHTML = "";

        options.forEach((opt,i)=>{
            let div = document.createElement("div");
            div.className = "option";
            div.innerText = opt;
            div.addEventListener("click", ()=> selectAnswer(i));
            optionsContainer.appendChild(div);
        });

        updateProgress();
    }

    // Select Answer
    function selectAnswer(i){
        let q = quizQuestions[current];
        let children = document.getElementById("options").children;

        for(let idx=0; idx<children.length; idx++){
            if(idx === q.shuffledAnswer){
                children[idx].style.background = "#4caf50";
                children[idx].style.color = "white";
            } else if(idx === i){
                children[idx].style.background = "#f44336";
                children[idx].style.color = "white";
            } else {
                children[idx].style.background = "#eee";
                children[idx].style.color = "black";
            }
            children[idx].style.pointerEvents = "none";
        }

        if(i === q.shuffledAnswer){
    score++;
    speak("Correct Answer");
} else {
    speak("Wrong Answer");
}

        clearInterval(interval);
        setTimeout(()=>{
            current++;
            if(current >= quizQuestions.length){
                finishQuiz();
            } else {
                timer=20;
                loadQuestion();
                startTimer();
            }
        },800);
    }

    // Next question
    window.nextQuestion = function(){
        current++;
        if(current >= quizQuestions.length){
            finishQuiz();
            return;
        }
        timer=20;
        loadQuestion();
    }

    // Timer
    function startTimer(){
        interval = setInterval(()=>{
            timer--;
            let t = document.getElementById("timer");
            if(t) t.innerText = timer;
            if(timer<=0) nextQuestion();
        },1000);
    }

    // Progress bar
    function updateProgress(){
        let percent = ((current+1)/quizQuestions.length)*100;
        document.getElementById("bar").style.width = percent+"%";
    }

    // Finish Quiz
    function finishQuiz(){
        clearInterval(interval);
        localStorage.setItem("score", score);
        saveLeaderboard();
        window.location = "result.html";
    }

    // Save Leaderboard
    function saveLeaderboard(){
        let name = localStorage.getItem("name");
        let board = JSON.parse(localStorage.getItem("leaderboard") || "[]");
        board.push({name:name,score:score});
        board.sort((a,b)=>b.score-a.score);
        board = board.slice(0,5);
        localStorage.setItem("leaderboard",JSON.stringify(board));
    }
window.logout = function(){
    localStorage.removeItem("loggedInUser");
    window.location = "login.html";
}
});document.addEventListener("mousemove", (e) => {
    const glow = document.getElementById("cursor-glow");
    if(glow){
        glow.style.left = e.clientX + "px";
        glow.style.top = e.clientY + "px";
    }
});function speak(text){
    let msg = new SpeechSynthesisUtterance(text);
    msg.rate = 1;
    msg.pitch = 1;
    msg.volume = 1;
    speechSynthesis.speak(msg);
}