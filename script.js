var red = document.querySelectorAll('.stones')
var submit = document.getElementById('submit')
var active_row = document.getElementsByClassName('active_r')
var delete_line = document.getElementById('delete_line')
const options = ["empty_circle", "red", "blue", "green", "yellow", "orange", "pink"]
var colour = ""
var next_row_num = 2
const to_guess = to_be_guessed()
var replay = document.getElementById('replay')
empt()

delete_line.addEventListener('click', function() {
    var circles = active_row[0].children[1].children;
    for (var i = 0; i < 4; i++) {
        circles[i].className = 'empty_circle';
    }
})

replay.onclick = function() {
    location.reload()
}

submit.onclick = function() {
    
    var guessed_colours = []
    var foo = active_row[0].children[1].children
    for (var i = 0; i < 4; i++) {
        guessed_colours.push(foo[i].classList[0])
    }
    if (isWinner(guessed_colours, to_guess)) {
        showWin()
        return
    }
    var key_pegs_array = key_pegs(to_guess, guessed_colours).sort()
    for (var j = 0; j < key_pegs_array.length; j++) {
        console.log(key_pegs_array[j])
    }

    update_key_pegs(key_pegs_array)

    if (next_row_num > 10) {
        showLose()
        return
    }

    var next_row = document.getElementsByClassName(`row_${next_row_num}`)
    var previous_row = document.getElementsByClassName(`row_${next_row_num - 1}`)
    previous_row[0].classList.remove('active_r')
    previous_row[0].children[1].classList.remove('active')
    
    next_row[0].classList.add('active_r')
    next_row[0].children[1].classList.add('active')
    next_row_num += 1
    
    empt()
}



function empt() {
    var empties = document.querySelectorAll('.empty_circle')
    empties.forEach(el => {
        if (el.parentElement.parentElement.classList.contains('active_r')) {
            el.addEventListener('dragover', dragOver)
            el.addEventListener('drop', dragDrop)
            el.addEventListener('dragend', dragEnd)
        }
        else {
            el.removeEventListener('dragover', dragOver)
            el.removeEventListener('drop', dragDrop)
            el.removeEventListener('dragend', dragEnd)
        }
    })
}


function to_be_guessed() {
    var guess_array = []
    for (var i = 0; i < 4; i++) {
        guess_array.push(options[Math.floor(Math.random() * 7)])
    }
    return guess_array
}

function isWinner(guessed, secret) {
    return guessed.every((colour, index) => colour === secret[index])
}

function showWin() {
    document.querySelector('.lost').style.display = 'flex'
    document.querySelector('.lost h2').textContent = 'Well Done!'
    document.querySelector('.side').style.pointerEvents = 'none'
    document.getElementById('play_again_win').onclick = () => location.reload()
}

function showLose() {
    var lostDiv = document.querySelector('.lost')
    lostDiv.style.display = 'flex'
    lostDiv.querySelector('h2').textContent = 'You\'ve Lost'
    var label = document.createElement('p')
    label.textContent = 'The secret was:'
    label.style.color = 'white'
    label.style.margin = '10px 0 5px 0'
    lostDiv.appendChild(label)
    var secretDiv = document.createElement('div')
    secretDiv.style.display = 'flex'
    secretDiv.style.justifyContent = 'center'
    secretDiv.style.alignItems = 'center'
    secretDiv.style.opacity = 1
    secretDiv.style.backgroundColor = 'white'
    secretDiv.style.border = '1px solid black'
    secretDiv.style.borderRadius = '10px'
    for (var i = 0; i < to_guess.length; i++) {
        var circle = document.createElement('div')
        circle.style.width = '25px'
        circle.style.height = '25px'
        circle.style.borderRadius = '50%'
        circle.style.backgroundColor = to_guess[i]
        circle.style.margin = '0 5px'
        circle.style.border = '2px solid white'
        secretDiv.appendChild(circle)
    }
    lostDiv.appendChild(secretDiv)
    document.querySelector('.side').style.pointerEvents = 'none'
    document.getElementById('play_again_win').onclick = () => location.reload()
}

function key_pegs(to_guess, guessed_colours) {
    var key_pegs_array = []
    var correct_ones = []
    for (var i = 0; i < 4; i++) {
        if (to_guess[i] == guessed_colours[i]) {
            key_pegs_array.push('black')
            correct_ones.push(guessed_colours[i])
        }
    }

    for (var j = 0; j < 4; j++) {
        if (to_guess[j] != guessed_colours[j] && to_guess.indexOf(guessed_colours[j]) != -1) {
            if (guessed_colours.slice(0, j + 1).filter(x => x == guessed_colours[j]).length + correct_ones.filter(x => x == guessed_colours[j]).length <= to_guess.filter(x => x == guessed_colours[j]).length) {
            key_pegs_array.push('white')
            }
        }
    }
    return key_pegs_array
}

function update_key_pegs(key_pegs_array) {
    var pegs = document.getElementsByClassName('pegs')
    for (var i = 0; i < 10; i++) {
        if (pegs[i].parentElement.parentElement.classList.contains('active_r')) {
            pegs_to_color = pegs[i].children
            for (var j = 0; j < key_pegs_array.length; j++) {
                pegs_to_color[j].classList.add(key_pegs_array[j])
            }
        }
    }
}


function dragStart() {
    colour = this.className
}

function dragDrop() {
    this.className = colour.slice(7, colour.length)
}

function dragEnd() {
}

function dragOver(e) {
    e.preventDefault()
}


red.forEach(function(el) {
    el.addEventListener('dragstart', dragStart)
})