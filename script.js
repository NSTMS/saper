let minesArr = new Set()
let cubesArray,helper, wasChecked,records = new Array()
let interval,firstClick,s_width,s_height,mines,nick,flags,click_counter = 0
let userTime,format = ""
class Cube{
    constructor(){
        this.id = 0
        this.isMine = false
        this.minesAround = 0
        this.x = 0
        this.y = 0
        this.isChecked = false
    }
    generateCube()
    {
        const cube = document.createElement("div")
        cube.classList.add(`one-cube`)
        cube.setAttribute("id",`${this.id}`)
        document.getElementById("main_content").appendChild(cube)
    }
}

function validation()
{
    s_width = parseInt(document.getElementById("form_width").value)
    s_height = parseInt(document.getElementById("form_height").value)
    mines = parseInt(document.getElementById("form_mines").value)
    nick = document.getElementById("form_nick").value
    
    
    if(nick.length == 0 || s_width <= 0 || s_height <=0 || mines < 3 || s_width*s_height<mines)
    {
        interval = clearInterval(interval)
        alert("mordo, złe dane")
    }else
    {
        interval = clearInterval(interval)
        generateSweeper()
    } 
    
}


function generateSweeper(){
    
    const temp = s_width*s_height;
    
    // generate grid with exact same width and height as cubes
    document.getElementById("main_nav").style.width = `${s_width*50}px`

    document.getElementById("main_content").style.width = `${s_width*50}px`
    document.getElementById("main_content").style.height = `${s_height*50}px`
    
    document.getElementById("main_content").style.gridTemplateColumns = `repeat(${s_width}, 50px)`
    document.getElementById("main_content").style.gridTemplateRows = `repeat(${s_height},50px)`
    
    // document.getElementById("leaderboard").style.height = document.getElementById("main_content").style.height 
    
    // settings reset
    document.getElementById("main_content").style.pointerEvents = "all"
    loadCookies()
    helper = []
    wasChecked = []
    firstClick = 0
    cubesArray = []
    flags = mines
    format = ""
    click_counter = 0
    document.getElementById("main_content").innerHTML = ``
    format = `${s_width}x${s_height}x${mines}`
    document.getElementById("timer").innerText = `00:00`
    document.getElementById("flags").textContent = `Flags: ${flags}`
    for(let i=0;i<temp;i++) wasChecked.push(i)

    generateMines(mines,temp);
    createCubes()
}

function generateMines(mines, max)
{
    minesArr.clear()
    do{
        minesArr.add(Math.floor(Math.random() * max))
    }
    while(minesArr.size < mines)

    console.log(minesArr)

}

function createCubes()
{
    let counter = 0
    
    // fill cubes tab
    cubesArray = new Array(s_height)
    for(let i=0;i<s_height;i++)
    {
        cubesArray[i] = new Array(s_width)
        for(let j=0;j<s_width;j++)
        {
            const square = new Cube()
            square.x = i
            square.y = j
            square.id = counter
            if(minesArr.has(counter)) square.isMine = true
            cubesArray[i][j] = square
            helper.push(square)
            square.generateCube()
            document.getElementById(counter).style.pointerEvents = "all"
            counter++
        }

    }

    counter = 0
    for(let x=0;x<s_height;x++)
    {
        for(let y=0;y<s_width;y++)
        {
            if(x != 0)
            {
                if(cubesArray[x-1][y].isMine == true) counter+=1
                if(y != 0) if(cubesArray[x-1][y-1].isMine == true) counter+=1
                if(y != s_width-1) if(cubesArray[x-1][y+1].isMine == true) counter+=1
            }
            
            if(y != 0) if(cubesArray[x][y-1].isMine == true) counter+=1
            
            if(x !== s_height-1)
            {
                if(cubesArray[x+1][y].isMine == true) counter+=1
                if(y != 0) if(cubesArray[x+1][y-1].isMine == true) counter+=1
                if(y != s_width-1) if(cubesArray[x+1][y+1].isMine == true) counter+=1
            }
            
            if(y != s_width-1) if(cubesArray[x][y+1].isMine == true) counter+=1
            
            cubesArray[x][y].minesAround = counter
            counter = 0
        }
    }
}


document.getElementById("main_content").addEventListener("click" ,(event)=>{
    if(event.target.id != "main_content")
    {
        if(event.target.classList.contains("flag") && event.which !== 3) return
        else cubesReveal(helper[event.target.id])
    }


})

function cubesReveal(cube)
{   
    cube.isChecked = true
    areYouWinningSon()
    if(cube != 'undefinded')
    {
        let x = parseInt(cube.x)
        let y = parseInt(cube.y)
        let checked = (wasChecked.includes(cube.id) == true)? true : false

        if(cube.isMine ==  false)
        {
            if(cube.minesAround == 0 && checked == true)
            {
                wasChecked.splice(wasChecked.indexOf(cube.id),1)
                
                if(x != 0)
                {
                    if(cubesArray[x-1][y] != 'undefinded') fill((x-1),(y))
                    if(y != 0) if(cubesArray[x-1][y-1] != 'undefinded') fill((x-1),(y-1))
                    if(y != s_width-1) if(cubesArray[x-1][y+1] != 'undefinded') fill((x-1),(y+1))
                }
    
                if(y != 0) if(cubesArray[x][y-1] != 'undefinded') fill(x,(y-1))
                
                if(x != s_height-1)
                {
                    if(cubesArray[x+1][y] != 'undefinded') fill((x+1),y)
                    if(y != 0) if(cubesArray[x+1][y-1] != 'undefinded') fill((x+1),(y-1))
                    if((y != s_width-1) && (x != s_height-1)) if(cubesArray[x+1][y+1] != 'undefinded') fill((x+1),(y+1))
                }

                if(y != s_width-1) if(cubesArray[x][y+1] != 'undefinded') fill((x),(y+1))

            }
            else if(checked == true && cube.minesAround != 0){
                if(document.getElementById(cubesArray[x][y].id).classList.contains("flag")) 
                {
                    document.getElementById(cubesArray[x][y].id).classList.remove("flag")
                    flags++
                    document.getElementById("flags").textContent = `Flags: ${flags}`
                }
                
                document.getElementById(cube.id).style.pointerEvents = "none"
                document.getElementById(cube.id).style.background = "rgba(0, 0, 0, 0.79)"
                document.getElementById(cube.id).innerText = cube.minesAround
                document.getElementById(cubesArray[x][y].id).style.pointerEvents = "none"
             
                wasChecked.splice(wasChecked.indexOf(cube.id),1)
            }
            areYouWinningSon()
        }
        else endGame()
    }

}


function fill(x,y)
{
        if(document.getElementById(cubesArray[x][y].id).classList.contains("flag")) 
        {
            document.getElementById(cubesArray[x][y].id).classList.remove("flag")
            flags++
            document.getElementById("flags").textContent = `Flags: ${flags}`
        }
        if(cubesArray[x][y].minesAround == 0) 
        {
            document.getElementById(cubesArray[x][y].id).style.background = "rgba(0, 0, 0, 0.72)"
            document.getElementById(cubesArray[x][y].id).style.pointerEvents = "none"

        }
        if(cubesArray[x][y].minesAround !=0){
            document.getElementById(cubesArray[x][y].id).style.pointerEvents = "none"
            document.getElementById(cubesArray[x][y].id).style.background = "rgba(0, 0, 0, 0.79)"
            document.getElementById(cubesArray[x][y].id).innerText = cubesArray[x][y].minesAround

        }
        cubesReveal(cubesArray[x][y])
}
        
function areYouWinningSon()
{
    if(wasChecked.length == mines) 
    {


        Array.from(document.getElementsByClassName("one-cube")).forEach(element =>{
            element.style.pointerEvents = "none"
        })  

        interval = clearInterval(interval)

        Array.from(document.getElementsByClassName("one-cube")).forEach(element =>{
            element.style.pointerEvents = "none"
        })

        setTimeout(()=>{
            alert("siema wygrałeś")
        },100)

        console.log(records)
        
        records.push(`${nick} ${userTime} -  ${format}`)
        document.cookie = records
        loadCookies()
    }

}
function loadCookies()
{
    document.getElementById("leaders").innerHTML = ""
    let div = document.createElement("div")
    if(document.cookie == ""){
        div.textContent = "nie ma cookie"
    }
    else{
        let array = document.cookie
        document.getElementById("leaders").innerHTML = ''
        array = array.split(",")
        array = sortArray(array)
        console.log("sorted:" , array)
        array.forEach(element =>{
            let div = document.createElement("div")
            div.textContent = element
            document.getElementById("leaders").appendChild(div)    
        })    }
    document.getElementById("leaders").appendChild(div)

}

function sortArray(array)
{
    let map = new Map()

    array.forEach( element =>{
        let temp = element.split(" ")
        let nickName = temp[0]
        let time = temp[1]
        let format = temp[4]
        map[time] = `${nickName} ${time} ${format}`
  })

    return map

}



function endGame()
{
    setTimeout(()=>{
        alert("siema przegrałeś")
    },100)

    interval = clearInterval(interval)

    Array.from(document.getElementsByClassName("one-cube")).forEach(element =>{
        element.style.pointerEvents = "none"
    })

    minesArr.forEach(element => {
        document.getElementById(element).style.background = "rgba(255, 0, 0, 0.75)"
    }) 
}

document.getElementById("main_content").addEventListener("mouseup" ,(event)=>{
    if(click_counter == 0)
    {      
        // set timer
        interval = clearInterval(interval)
        let minutes = 0
        let seconds = 0
        let miliseconds = 0
        let time_counter = 0

        interval = setInterval(() => {
            if(miliseconds % 1000 == 0)
            {
                seconds++
                if(seconds % 60 == 0)
                {
                    minutes++
                    seconds=0
                }
                miliseconds=0
            }
            if(seconds < 10)
            {
                if(minutes < 10)
                {
                    document.getElementById("timer").textContent = `0${minutes}:0${seconds}`
                }
                else{
                    document.getElementById("timer").textContent = `${minutes}:0${seconds}`
                }
            }
            else{
                document.getElementById("timer").textContent = `${minutes}:${seconds}`
            }
            userTime = `${minutes}:${seconds}::${miliseconds}`
            miliseconds+=4
        },4)
        interval = setInterval(() => {
        seconds = seconds < 10 ? `0${seconds}` : seconds
        if(seconds % 60 == 0)
        {
            time_counter != 0 ? minutes++ : time_counter++
            minutes = minutes < 10 ? `0${minutes}` : minutes
            seconds=0
        }
        document.getElementById("timer").innerText = `${minutes}:${seconds}`
        seconds++
    },1000)

        click_counter++;
    }

    document.getElementById("flags").textContent = `Flags: ${flags}`
        if(event.which == 3)
        {
            if(helper[event.target.id].isChecked !== "undefinded")
            {
                if(helper[event.target.id].isChecked == false && event.target.id != "main_content" && flags != 0)
                {
                    if(event.target.classList.contains("flag"))
                    {
                        event.target.classList.remove("flag")
                        flags++
                    }else 
                    {
                        flags--
                        event.target.classList.add("flag")
                    }
                }
            }
         
        }
});