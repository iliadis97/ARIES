var x,i,j,sumOfLines,row,cell,undoFin;
var size = 3;
var table = document.getElementById('tbl');
var runTrans = [];
var abortTrans = [];
var comTrans = [];
var idTable = [];
var stolenAt = [];
var pageLSN = [];
var correctedLSN = [];
var indexx = [];
var recLSN = [];
var lastLSN = [];
var prevLSN = [];
var undonextLsn = [];
var obj = [];
var pageTable = ["P1", "P2", "P3"];

//The blank table that the user makes
var tt = document.getElementById("tt");
//The actual TT
var ttSol = document.getElementById("tt1");
//The blank dpt that the user makes
var dpt = document.getElementById("dpt");
//The actual DPT
var dptSol = document.getElementById("dpt1");

document.getElementById("button1").classList.add("btn-group");
document.getElementById("button2").classList.add("btn-group");

function clearInp() {
  document.getElementById("numb").value = "";
  document.getElementById("running").value = "";
  document.getElementById("aborting").value = "";
  document.getElementById("committed").value = "";
  document.getElementById("lsn").value = "";
  document.getElementById("start").value = "";
  document.getElementById("redostart").value = "";
  document.getElementById("undofinish").value = "";
  }

function numTest() {
  var text;
  x = document.getElementById("numb").value;   
  // If x is Not a Number or less than one or greater than 10
  if (isNaN(x) || x < 1 || x > 10) {
    text = "Input not valid, try again!"
    }  else {
      document.getElementById("id1").style.visibility = "visible";
      text = " ";
    }
  document.getElementById("demo").innerHTML = text;
}

function scheduleGenerate() {
  var com,run,abt,sum,z,transId,num,crosser,it,str;
  var beginCheck,endCheck;
  
  com = document.getElementById("committed").value;
  run = document.getElementById("running").value;
  abt = document.getElementById("aborting").value;

  sum = Number(com) + Number(run) + Number(abt);

  if(sum!=x) {
    document.getElementById("demo1").innerHTML = "Their sum must be:" + x;
  }
  else {
    document.getElementById("flushing").style.visibility = "visible";
    document.getElementById("gnrt").disabled = true;

    document.getElementById("demo1").innerHTML = " ";

    table.style.visibility = "visible";
   
    var counter = [];
    
    var justAborted = [];
    
    //Number of lines per type of transaction
    var runLines = Math.floor(Math.random() * 3) + 2;
    var abtLines = 4;
    var comLines = Math.floor(Math.random() * 3) + 2;
    
    //Total number of lines in the table without header row
    sumOfLines = com*comLines + run*runLines + abt*abtLines + 2;
    
    //Special random code to determine where each transaction goes
    var runCode = Math.floor(Math.random() * 3) + 1;
    var abtCode = Math.floor(Math.random() * 3) + 1;
    while(abtCode==runCode) {
      abtCode = Math.floor(Math.random() * 3) + 1;
    }
    var comCode = Math.floor(Math.random() * 3) + 1;
    while(comCode==runCode || comCode==abtCode) {
      comCode = Math.floor(Math.random() * 3) + 1;
    }

    var flag;

    //Decide if a transaction is running, aborting or committing
    for(i=1;i<=x;i++) {
      transId = "T" + i;
      flag = true;
      while(flag==true) {
      z = Math.floor(Math.random() * 3) + 1;
      if(z==runCode) {
        runTrans.push(transId);
        if(runTrans.length<=run) {
          flag = false;
        } else {
          runTrans.pop();
        }
      } else if(z==abtCode) {
        abortTrans.push(transId);
        if(abortTrans.length<=abt) {
          flag = false;
        } else {
          abortTrans.pop();
        }
      } else {
        comTrans.push(transId);
        if(comTrans.length<=com) {
          flag = false;
        } else {
          comTrans.pop();
        }
      }
      }
    }

    //Initial checkpoint
    beginCheck = 1;
    endCheck = 2;

    //Optional checkpoint
    var randomProb = Math.floor(Math.random() * 10) + 1;
    if(randomProb>2) {
      sumOfLines += 2;
      var bonusBeginCheckpoint,bonusEndCheckpoint;
      bonusBeginCheckpoint = Math.floor(Math.random() * 5) + 3;
      bonusEndCheckpoint = Math.floor(Math.random() * sumOfLines-2) + 1;
      while(bonusEndCheckpoint<=bonusBeginCheckpoint+2) {
        bonusEndCheckpoint = Math.floor(Math.random() * sumOfLines-2) + 1;
      }
    }

    //Array that stores the number of lines that are written in the table
    for(i=0;i<x;i++) {
      var inc = i+1;
      counter[i] = 0;
      prevLSN[i] = "-";
      justAborted.push(false);
      idTable[i] = "T" + inc;
    }

    var randPage;
    var lsn = 0;
    var pageCounter = 1;

    //Creating the schedule table
    for(i=1;i<=sumOfLines;i++) {
      row = table.insertRow(i);
      if(i>2) {
        lsn += 10;
      }
      var clrValue;
      var done = false;
      var rand = Math.floor(Math.random() * x) + 1;
      for(j=1;j<=x;j++) {
        if(counter[j-1]==0 && rand>j) {
          rand = j;
        }
      }
      for(var cs=1;cs<=x;cs++) {
        if(justAborted[cs-1]==true) {
          rand = cs;
        }
      }
      var randomTransaction = "T" + rand;
      
      if(pageCounter<4) {
        randPage = pageCounter;
      } else {
        randPage = Math.floor(Math.random() * 3) + 1;
      }
      while((runTrans.includes(randomTransaction)&&counter[rand-1]==runLines)||(abortTrans.includes(randomTransaction)&&counter[rand-1]==abtLines)||(comTrans.includes(randomTransaction)&&counter[rand-1]==comLines)) {
        rand = Math.floor(Math.random() * x) + 1;
        for(j=1;j<=x;j++) {
          if(counter[j-1]==0 && rand>j) {
            rand = j;
          }
        }
        randomTransaction = "T" + rand;
      }
      for(j=0;j<6;j++) {
        cell = row.insertCell(j);
        if(cell.cellIndex==0) {
          cell.innerHTML = lsn;
        }
        if(i==beginCheck) {
          if(j==0) {
            cell.innerHTML = "00";
          }
          if(j==3) {
            cell.innerHTML = "BEGIN_CHECKPOINT";
          }
        } else if(i==endCheck) {
          if(j==0) {
            cell.innerHTML = "05";
          }
          if(j==3) {
            cell.innerHTML = "END_CHECKPOINT";
          }
        } else if(i==bonusBeginCheckpoint) {
          if(j==3) {
            cell.innerHTML = "BEGIN_CHECKPOINT";
          }
        } else if(i==bonusEndCheckpoint) {
            if(j==3) {
              cell.innerHTML = "END_CHECKPOINT";
            }
          } else {
          if(cell.cellIndex==1) {
            cell.innerHTML = prevLSN[rand-1];
          }
          if(cell.cellIndex==2) {
            cell.innerHTML = randomTransaction;
          }
          if(cell.cellIndex==3) {
            if(abortTrans.includes(randomTransaction)) {
              if(counter[rand-1]==abtLines-2) {
              cell.innerHTML = "ABORT";
              clrValue = prevLSN[rand-1];
              justAborted[rand-1] = true;
              } else if(counter[rand-1]==abtLines-1) {
                cell.innerHTML = "CLR " + clrValue;
                done = true;
                justAborted[rand-1] = false;
              } else {
                cell.innerHTML = "UPDATE";
              }
            } else if(comTrans.includes(randomTransaction)&&(counter[rand-1]==comLines-1)) {
              cell.innerHTML = "COMMIT";
            } else {
              cell.innerHTML = "UPDATE";
            }
            counter[rand-1] += 1;
            prevLSN[rand-1] = lsn;
          }
          if(cell.cellIndex==4) {
            if(table.rows[i].cells[3].innerHTML=="UPDATE") {
              cell.innerHTML = pageTable[randPage-1];
              pageCounter += 1;
            }
          }
          if(cell.cellIndex==5) {
            var activeTrans = table.rows[i].cells[2].innerHTML;
            if(done==true) {
              for(var s=1;s<=i;s++) {
                if(s*10==clrValue&&table.rows[s+2].cells[2].innerHTML==activeTrans) {
                  undonextLsn[rand-1] = table.rows[s+2].cells[1].innerHTML;
                }
              }
              cell.innerHTML = undonextLsn[rand-1];
            }
          }
      } 
      }
    }
    document.getElementById("demo2").innerHTML = "Running transactions: " + runTrans;
    document.getElementById("demo3").innerHTML = "Aborting transactions: " + abortTrans;
    document.getElementById("demo4").innerHTML = "Committed transactions: " +comTrans;

    for(i=0;i<sumOfLines;i++) {
      indexx[i] = Number(table.rows[i+1].cells[0].innerHTML);
    }

    for(i=0;i<pageTable.length;i++) {
      correctedLSN[i] = "-";
    }

    str = " ";

    //Calculate pageLSN
    for(j=0;j<3;j++) {
      num = Math.random();
      it = 3;
      while(it<=sumOfLines) {
        if(table.rows[it].cells[4].innerHTML==pageTable[j]) {
          var first = Number(table.rows[it].cells[0].innerHTML);
          break;
        }
        it+=1;
      }
      if(num>=0.5) {
        crosser = first;
        for(var el1=0;el1<sumOfLines;el1++) {
          if(indexx[el1]==crosser) {
            break;
          }
        }
        num = Math.random();
        while(table.rows[el1+1].cells[4].innerHTML!=pageTable[j]) {
          crosser+=10;
          num = Math.random();
          el1+=1;
        }
        stolenAt[j] = crosser;
        for(i=3;i<=sumOfLines;i++) {
          if(table.rows[i].cells[4].innerHTML==pageTable[j]) {
            pageLSN[j] = Number(table.rows[i].cells[0].innerHTML);
          }
          if(Number(table.rows[i].cells[0].innerHTML)==stolenAt[j]) {
            break;
          }
        }
        str = str + "-Page " + pageTable[j] + " has been stolen to the disk at LSN = " + stolenAt[j] + "<br><br>" ;
      } else {
        stolenAt[j] = "-";
        pageLSN[j] = "-";
      }
    }
    document.getElementById("demo5").innerHTML = str;

    for(j=0;j<3;j++) {
      if(stolenAt[j]!="-") {
        for(i=3;i<=sumOfLines;i++) {
          if(Number(table.rows[i].cells[0].innerHTML)==stolenAt[j]) {
            table.rows[i].cells[4].classList.add("animating");
            obj.push(table.rows[i].cells[4]);
          }
        }
      }
    }
  }
}

function colorTable() {
  var flag;
  var flushed = document.getElementById("lsn").value;
  for(i=0;i<obj.length;i++) {
    obj[i].classList.remove("animating");
  }
  for(i=1;i<=sumOfLines;i++) {
    if(Number(table.rows[i].cells[0].innerHTML)==flushed) {
      flag = true;
      break;
    }
  }
  if(flag==true) {
  for(i=1;i<=sumOfLines;i++) {
    if(Number(table.rows[i].cells[0].innerHTML)<=flushed) {
      table.rows[i].classList.add("flushedColor");
    }
    else {
      table.rows[i].classList.add("unsavedColor");
    }
  }
  document.getElementById("button1").style.visibility = "visible";
  document.getElementById("demo8").innerHTML = " ";
} else {
  document.getElementById("demo8").innerHTML = "Invalid input, give a valid LSN!";
}
  document.getElementById("colorButton").disabled = true;
}

function analysis() {
  var pagesVisited = [];
  var status = [];
  var act,page,type;
  var flushedLSN = document.getElementById("lsn").value;
  
  document.getElementById("phase1").style.visibility = "visible";
  //Create the real tt, which is the solution
  for(i=0;i<x;i++) {
    var crosser = 3;
    act = idTable[i];
    while(Number(table.rows[crosser].cells[0].innerHTML)<=flushedLSN) {
      type = table.rows[crosser].cells[3].innerHTML;
      if(table.rows[crosser].cells[2].innerHTML==act) {
        lastLSN[i] = table.rows[crosser].cells[0].innerHTML;
        if(type=="UPDATE") {
          status[i] = "R";
        } else if(type=="COMMIT") {
          status[i] = "C";
        } else {
          status[i] = "A";
        }
      }
      crosser += 1;
      if(crosser>sumOfLines) {
        break;
      }
    }
  }
  for(i=0;i<lastLSN.length;i++) {
    row = ttSol.insertRow(i+1);
    for(j=0;j<3;j++) {
      cell = row.insertCell(j);
      if(cell.cellIndex==0) {
        cell.innerHTML = idTable[i];
      }else if(cell.cellIndex==1) {
        cell.innerHTML = lastLSN[i];
      } else {
        cell.innerHTML = status[i];
      }
    }
  }
  //Create the empty tt for the user to fill
  for(i=1;i<=lastLSN.length;i++) {
    row = tt.insertRow(i);
    for(j=0;j<4;j++) {
      cell = row.insertCell(j);
      cell.innerHTML = String.fromCharCode(160);
      cell.contentEditable = "true";
      if(j==3) {
        cell.style.borderColor= "white";
        cell.style.borderLeftColor = "solid black";
        cell.contentEditable = "false";
        cell.style.backgroundColor = "white";
      }
    }
  }
  cell = tt.rows[0].insertCell(3);
  cell.style.borderColor= "white";
  cell.style.borderLeftColor = "solid black";

  //Create the real dpt, which is the solution
  for(i=1;i<=3;i++) {
    crosser = 3;
    page = pageTable[i-1];
      while((Number(table.rows[crosser].cells[0].innerHTML)<=flushedLSN)) {
        if((table.rows[crosser].cells[4].innerHTML==page)&&(!pagesVisited.includes(page))) {
        recLSN[i-1] = table.rows[crosser].cells[0].innerHTML;
        pagesVisited.push(page);
        }
        crosser += 1;
        if(crosser>sumOfLines) {
          break;
        }
      }
  }

  //Shape DPT
  for(i=0;i<recLSN.length;i++) {
    row = dptSol.insertRow(i+1);
    for(j=0;j<2;j++) {
      cell = row.insertCell(j);
      if(cell.cellIndex==0) {
        cell.innerHTML = pageTable[i];
      } else {
        cell.innerHTML = recLSN[i];
      }
    }
  }
  for(i=0;i<3;i++) {
    if(stolenAt[i]!="-") {
    if(Number(stolenAt[i])>Number(flushedLSN)) {
      stolenAt[i] = "-";
    } else {
      var found = false;
      for(j=1;j<=sumOfLines;j++) {
        if(Number(table.rows[j].cells[0].innerHTML)>Number(stolenAt[i])&&Number(table.rows[j].cells[0].innerHTML)<=Number(flushedLSN)&&table.rows[j].cells[4].innerHTML==pageTable[i]) {
          for(var s=1;s<=size;s++) {
            if(dptSol.rows[s].cells[0].innerHTML==pageTable[i]) {
              dptSol.rows[s].cells[1].innerHTML = Number(table.rows[j].cells[0].innerHTML);
              found = true;
              break;
            }
          }
          break;
        }
      }
      if(found==false) {
        if(i==0) {
          dptSol.deleteRow(1);
        } else if(i==1) {
            if(size==2) {
              dptSol.deleteRow(1);
            } else {
                dptSol.deleteRow(2);
            }
        } else {
            if(size==1) {
              dptSol.deleteRow(1);
            } else if(size==2) {
              dptSol.deleteRow(2);
            } else {
              dptSol.deleteRow(3);
            }
        }
        size-=1;
      }
    }
  }
}

  //Create the empty DPT for the user to fill
  for(i=1;i<=size;i++) {
    row = dpt.insertRow(i);
    for(j=0;j<3;j++) {
      cell = row.insertCell(j);
      cell.innerHTML = String.fromCharCode(160);
      cell.contentEditable = "true";
      if(j==2) {
        cell.style.borderColor= "white";
        cell.style.borderLeftColor = "solid black";
        cell.contentEditable = "false";
      }
    }
  }
  cell = dpt.rows[0].insertCell(2);
  cell.style.borderColor= "white";
  cell.style.borderLeftColor = "solid black";
  document.getElementById("button1").disabled = true;
  document.getElementById("Checkdpt").addEventListener("click",function() {checkDPT(size)});
}

function checkStart() {
  var start,start1,start2,endCheck;
  var flushedLSN = document.getElementById("lsn").value;
  var userInput = document.getElementById("start").value;

  start1 = Number(table.rows[1].cells[0].innerHTML);

  for(i=1;i<=sumOfLines;i++) {
    if(table.rows[i].cells[3].innerHTML == "BEGIN_CHECKPOINT") {
      start2 = Number(table.rows[i].cells[0].innerHTML);
    }
    if(table.rows[i].cells[3].innerHTML == "END_CHECKPOINT") {
      endCheck = Number(table.rows[i].cells[0].innerHTML);
    }
  }
  if(endCheck>flushedLSN) {
    start = start1;
  } else {
    start = start2;
  }
  if(userInput==start) {
    alert("Correct!");
    document.getElementById("anStart").disabled = true;
    document.getElementById("demo6").style.visibility = "visible";
    document.getElementById("demo7").style.visibility = "visible";
    document.getElementById("tt").style.visibility = "visible";
    document.getElementById("Checktt").style.visibility = "visible";
    document.getElementById("Solvett").style.visibility = "visible";
    document.getElementById("dpt").style.visibility = "visible";
    document.getElementById("Checkdpt").style.visibility = "visible";
    document.getElementById("Solvedpt").style.visibility = "visible";
    document.getElementById("button2").style.visibility = "visible";
  }
  else {
    alert("Wrong, the correct answer is " + start);
  }
}
 
function checkTT() {
  for(i=1;i<=lastLSN.length;i++) {
    for(var x=1;x<=lastLSN.length;x++) {
      var flag = true;
      for(j=0;j<3;j++) { 
        if(tt.rows[i].cells[j].textContent.trim()!=ttSol.rows[x].cells[j].textContent) {
          flag = false;
          break;
        }
      }
      if(flag==true) {
        break;
      }
    }
    if(flag==false) {
      tt.rows[i].classList.add("unsavedColor");
      tt.rows[i].classList.remove("flushedColor");
      tt.rows[i].cells[3].innerHTML = String.fromCharCode(10060);
    } else {
      tt.rows[i].classList.add("flushedColor");
      tt.rows[i].classList.remove("unsavedColor");
      tt.rows[i].cells[3].innerHTML = String.fromCharCode(9989);
    }
  }
  for(i=1;i<=x;i++) {
    tt.rows[i].cells[3].style.backgroundColor = "white";
    }
  }


function showTT() {
  document.getElementById("tt1").style.visibility = "visible";
}

function checkDPT(sz) {
  for(i=1;i<=sz;i++) {
    for(var x=1;x<=sz;x++) {
      var flag = true;
      for(j=0;j<2;j++) {
        if(dpt.rows[i].cells[j].textContent.trim()!=dptSol.rows[x].cells[j].textContent) {
          flag = false;
          break;
        }
      }
      if(flag==true) {
        break;
      }
    }
    if(i>1) {
    if(dpt.rows[i].cells[0].textContent.trim()==dpt.rows[i-1].cells[0].textContent.trim()||(dpt.rows[i].cells[0].textContent.trim()==dpt.rows[i-2].cells[0].textContent.trim())) {
      flag = false;
    }
  }
    if(flag==false) {
      dpt.rows[i].classList.add("unsavedColor");
      dpt.rows[i].classList.remove("flushedColor");
      dpt.rows[i].cells[2].innerHTML = String.fromCharCode(10060);
    } else {
      dpt.rows[i].classList.add("flushedColor");
      dpt.rows[i].classList.remove("unsavedColor");
      dpt.rows[i].cells[2].innerHTML = String.fromCharCode(9989);
    }
  }
  for(i=1;i<=recLSN.length;i++) {
    dpt.rows[i].cells[2].style.backgroundColor = "white";
    }
}

function showDPT() {
  document.getElementById("dpt1").style.visibility = "visible";
}

function redo() {
  document.getElementById("phase1").style.left = "1800px";
  document.getElementById("phase2").style.visibility = "visible";
 
  var counter = 0;
  var flushedLSN = document.getElementById("lsn").value;
  var rowRedone = [];
  var testRedoTable = table.cloneNode(true);
  
  document.getElementById("demo9").style.display = "none";
  
  //We define the redone rows
  for(i=1;i<=sumOfLines;i++) {
    rowRedone[i-1] = false;
    var type = table.rows[i].cells[3].innerHTML;
    var lsn = Number(table.rows[i].cells[0].innerHTML);
    if(type=="UPDATE") {
      var pg = table.rows[i].cells[4].innerHTML;
    } else {
        if(type.includes("CLR")) {
          var clr = Number(table.rows[i].cells[5].innerHTML);
          for(j=1;j<=sumOfLines;j++) {
            if(Number(table.rows[j].cells[1].innerHTML)==clr) {
              var pg = table.rows[j].cells[4].innerHTML;
              break;
            }
          }
        }
      }
    if(type=="UPDATE"||type.includes("CLR")) {
    for(j=0;j<3;j++) {
      if(pageTable[j]==pg) {
        if(stolenAt[j]=="-") {
          rowRedone[i-1] = true;
          break;
        }
        for(var gs=1;gs<=size;gs++) {
          if(dptSol.rows[gs].cells[0].innerHTML==pg) {
            if(Number(dptSol.rows[gs].cells[1].innerHTML)<=lsn||Number(pageLSN[j])<lsn) {
              rowRedone[i-1] = true;
              break;
            }
          }
        }
      }
    }
  }
    if(Number(table.rows[i].cells[0].innerHTML)==flushedLSN) {
      break;
    }
  }

  //Calculation of the table with the redone rows
  var redoTable = document.getElementById("table2");
  for(i=1;i<=sumOfLines;i++) {
    row = table.rows[i].cloneNode(true);
    if(rowRedone[i-1]==true) {
      redoTable.appendChild(row);
      counter += 1;
    }
    if(Number(table.rows[i].cells[0].innerHTML)==flushedLSN) {
      break;
    }
  }

  //Here we create the test table 
  document.getElementById("demo9").appendChild(testRedoTable);
  for(i=1;i<=sumOfLines;i++) {
    row = testRedoTable.rows[i];
    testRedoTable.rows[i].classList.remove("flushedColor","unsavedColor");
    row.style.cursor = "pointer";
    cell = row.insertCell(6);
    cell.style.borderColor= "white";
    cell.style.borderLeftColor = "solid black";
    cell.style.visibility = "hidden";
    if(rowRedone[i-1]==true) {
      cell.innerHTML = String.fromCharCode(9989);
    } else {
      cell.innerHTML = String.fromCharCode(10060);
    }
  }
  cell = testRedoTable.rows[0].insertCell(6);
  cell.style.borderColor= "white";
  cell.style.borderLeftColor = "solid black";
  
  for(i=0;i<counter;i++) {
    redoTable.rows[i].classList.remove("flushedColor");
  }
  var y=1;
  while(y<=sumOfLines) {
    addLstnr(testRedoTable.rows[y]);
    y += 1;
  }
  document.getElementById("button2").disabled = true;
}

function checkRedoStart() {
  var start = recLSN[0];
  var userInput = document.getElementById("redostart").value;
  if(userInput==start) {
    alert("Correct!");
    document.getElementById("redoBut").disabled = true;
    document.getElementById("demo9").style.display = "block";
    document.getElementById("demo10").style.visibility = "visible";
    document.getElementById("solveRedo").style.visibility = "visible";
    document.getElementById("button3").style.visibility = "visible";
  } else {
    alert("Wrong, the correct answer is " + start);
  }
}

function addLstnr(r) {
  r.addEventListener("click",function() {checkEachRow(r)});
}

function checkEachRow(r) {
  r.cells[6].style.visibility = "visible";
}

function showRedoTable() {
  document.getElementById("table2").style.visibility = "visible";
  document.getElementById("demo11").style.visibility = "visible";
}

function undo() {
  document.getElementById("phase1").style.left = "2950px";
  document.getElementById("phase2").style.left = "1800px";
  document.getElementById("phase3").style.visibility = "visible";

  var lsn,prevlsn,transaction,type,len,maxIndex,index;
  var flushedLSN = document.getElementById("lsn").value;
  var undoTable = document.getElementById("undoTable");
  var testUndoTable = document.getElementById("testUndoTable");
  var checkButton = document.getElementById("checkbtn");
  var toUndo = [];
  var toUndoCommit = [];
  var pos = 1;
  var last = flushedLSN;
  var next = " ";
  var undoRows = 0;

  for(i=0;i<lastLSN.length;i++) {
    if(ttSol.rows[i+1].cells[2].innerHTML=="R"||ttSol.rows[i+1].cells[2].innerHTML=="A") {
      toUndo.push(lastLSN[i]);
    } else {
      toUndoCommit.push(lastLSN[i]);
    }
    if(prevLSN[i]>flushedLSN) {
      prevLSN[i] = lastLSN[i];
    }
  }

  toUndo.sort(function(a,b){return a-b});
  toUndoCommit.sort(function(a,b){return a-b});

  var max=0;
  lsn = last;
  while(toUndoCommit.length>0) {
    len = toUndoCommit.length;
    max = toUndoCommit[len-1];
    toUndoCommit.pop();
    for(j=1;j<=sumOfLines;j++) {
      if(Number(table.rows[j].cells[0].innerHTML)==max) {
        lsn = Number(last)+10;
        last = lsn;
        prevlsn = max;
        transaction = table.rows[j].cells[2].innerHTML;
        type = "END";
      }
    }
    row = undoTable.insertRow(pos);
    row.classList.add("warningColor");
    undoRows += 1;
    pos += 1;
    for(j=0;j<7;j++) {
      cell = row.insertCell(j);
      if(j==0) {
        cell.innerHTML = lsn;
      } else if(j==1) {
        cell.innerHTML = prevlsn;
      } else if(j==2) {
        cell.innerHTML = transaction;
      } else if(j==3) {
        cell.innerHTML = type;
      } else {
          if(j==6) {
          cell.style.borderColor= "white";
          cell.style.borderLeftColor = "solid black";
          cell.innerHTML = "REDO PHASE!";
          cell.style.backgroundColor = "white";
        }
      }
    }
  }

  while(toUndo.length>0) {
    var end = false;
    len = toUndo.length;
    maxIndex = len-1;
    max = toUndo[maxIndex];
    for(i=1;i<=sumOfLines;i++) {
      transaction = table.rows[i].cells[2].innerHTML;
      for(j=0;j<idTable.length;j++) {
        if(idTable[j]==transaction) {
          index = j;
          break;
        }
      }
      prevlsn = lastLSN[index];
      if(Number(table.rows[i].cells[0].innerHTML)==max) {
        if(table.rows[i].cells[3].innerHTML.includes("CLR")) {
          toUndo[maxIndex] = table.rows[i].cells[5].innerHTML;
          toUndo.sort(function(a,b){return a-b});
          break;
        }
        else {
          lsn = Number(lsn) + 10;
          if(table.rows[i].cells[3].innerHTML.includes("ABORT")) {
            type = "CLR " + table.rows[i].cells[1].innerHTML;
            next = undonextLsn[index];
            toUndo[maxIndex] = undonextLsn[index];
            
        } else {   
            type = "CLR " + max;
            next = table.rows[i].cells[1].innerHTML;
            toUndo[maxIndex] = table.rows[i].cells[1].innerHTML;
            if(next=="-") {
              end = true;
              undoFin = max;
            }
        }
        addRow(undoTable,pos,lsn,prevLSN[index],transaction,type,next,toUndo);
        undoRows += 1;
        pos += 1;
        prevLSN[index] = lsn;
        if(end==true) {
          lsn = Number(lsn) + 10;
          type = "END";
          next = "";
          toUndo.pop();
          addRow(undoTable,pos,lsn,prevLSN[index],transaction,type,next,toUndo);
          undoRows += 1;
          pos += 1;
        }
        break;
      }
    }
  } 
    
    toUndo.sort(function(a,b){return a-b});
  }

  //We create the empty table for the user to fill
  for(i=1;i<=undoRows;i++) {
    row = testUndoTable.insertRow(i);
    for(j=0;j<7;j++) {
      cell = row.insertCell(j);
      cell.innerHTML = String.fromCharCode(160);
      cell.contentEditable = "true";
      if(j==6) {
        cell.style.borderColor= "white";
        cell.style.borderLeftColor = "solid black";
        cell.contentEditable = "false";
      }
    }
  }
  cell = testUndoTable.rows[0].insertCell(6);
  cell.style.borderColor= "white";
  cell.style.borderLeftColor = "solid black";
  
  cell = undoTable.rows[0].insertCell(6);
  cell.style.borderColor= "white";
  cell.style.borderLeftColor = "solid black";
  
  checkButton.onclick = function() {checkUndoTable(undoTable,testUndoTable,undoRows)};
  document.getElementById("button3").disabled = true;
}

function checkFinish() {
  var userInput = document.getElementById("undofinish").value;
  if(userInput==undoFin) {
    alert("Correct!");
    document.getElementById("checkfinish").disabled = true;
    document.getElementById("testUndoTable").style.visibility = "visible";
    document.getElementById("checkbtn").style.visibility = "visible";
    document.getElementById("undosolve").style.visibility = "visible";
  } else {
    alert("Wrong, the correct answer is " + undoFin);
  }
}

function addRow(t,position,lsn,prev,trans,type,next,set) {
  row = t.insertRow(position);
  for(j=0;j<7;j++) {
    cell = row.insertCell(j);
    if(j==0) {
      cell.innerHTML = lsn;
    } else if(j==1) {
      cell.innerHTML = prev;
    } else if(j==2) {
      cell.innerHTML = trans;
    } else if(j==3) {
      cell.innerHTML = type;
    } else if(j==5) {
      cell.innerHTML = next;
    } else if(j==6){
      cell.style.borderColor= "white";
      cell.style.borderLeftColor = "solid black";
      cell.innerHTML = "ToUndo= ["+ set + "]";
    }
  }
}

function checkUndoTable(t1,t2,num) {
  for(i=1;i<=num;i++) { 
    var flag = true;
    for(j=0;j<6;j++) {
      if(t1.rows[i].cells[j].textContent!=t2.rows[i].cells[j].textContent.trim()) {
        flag = false;
        break;
      }
    }
    if(flag==false) {
      t2.rows[i].classList.add("unsavedColor");
      t2.rows[i].classList.remove("flushedColor");
      t2.rows[i].cells[6].innerHTML = String.fromCharCode(10060);
    } else {
      t2.rows[i].classList.add("flushedColor");
      t2.rows[i].classList.remove("unsavedColor");
      t2.rows[i].cells[6].innerHTML = String.fromCharCode(9989);
    }
}
  for(i=1;i<=num;i++) {
    t2.rows[i].cells[6].style.backgroundColor = "white";
    }
}

function showUndo() {
  document.getElementById("undoTable").style.visibility = "visible";
  document.getElementById("showChart").style.visibility = "visible";
}

function showChart() {  
  var from,to;
  var flush = document.getElementById("lsn").value;
  var hasAppeared = [];
  for(i=0;i<idTable.length;i++) {
    hasAppeared[i] = false;
  }
  var x = 50;
  var height = 50;
  var rowNum = 0;
  var canvas = document.getElementById("chart");
  var ctx = canvas.getContext("2d");
  for(i=3;i<sumOfLines;i++) {
    if(Number(table.rows[i].cells[0].innerHTML)<=Number(flush)) {
      rowNum += 1;
    } else {
      break;
    }
  }
  setCanvasSize(canvas,rowNum);
  ctx.font = "30px Arial";
  ctx.lineWidth = 8;
  //Here we put the transaction IDs on the vertical axis
  for(i=0;i<idTable.length;i++) {
    ctx.fillText(idTable[i],10,height);
    for(var ss=3;ss<=sumOfLines;ss++) {
      if(table.rows[ss].cells[2].innerHTML==idTable[i]) {
        var firstLsn = Number(table.rows[ss].cells[0].innerHTML);
        break;
      }
    }
    if(firstLsn==10) {
      from = 65;
    } else {
      from = ((firstLsn-10)/10)*60 + 65;
    }
    for(ss=1;ss<=lastLSN.length;ss++) {
      if(ttSol.rows[ss].cells[0].innerHTML==idTable[i]) {
        if(ttSol.rows[ss].cells[2].innerHTML=="C") {
          to = ((Number(lastLSN[i])-10)/10)*60 + 65;
          ctx.strokeStyle = "#0000FF";
          ctx.beginPath();
          ctx.moveTo(from,height-5);
          ctx.lineTo(to,height-5);
          ctx.stroke();
          ctx.fillText(String.fromCharCode(9632),from-10,height+2);
          ctx.fillText(String.fromCharCode(9632),to-10,height+2);
        } else {
          to = ((Number(flush)-10)/10)*60 + 65;
            ctx.strokeStyle = "#8B0000";
            ctx.beginPath();
            ctx.moveTo(from,height-5);
            ctx.lineTo(to,height-5);
            ctx.stroke();
            ctx.fillText(String.fromCharCode(9632),from-10,height+2);
            ctx.fillText(String.fromCharCode(10060),to-10,height+7);
        }
      }
    }
    height += 45;
  }
  height += 20;
  //We put the LSN numbers on the horizontal axis
  for(i=3;i<=sumOfLines;i++) { 
    if(Number(table.rows[i].cells[0].innerHTML)<=Number(flush)) {
    ctx.fillText(table.rows[i].cells[0].innerHTML,x,height);
    x += 60;
    } else {
      break;
    }
  }
  x -= 60;
  ctx.lineWidth = 10;
  ctx.strokeStyle = "#FF0000";
  ctx.setLineDash([12, 8]);
  ctx.beginPath();
  ctx.moveTo(x+20,0);
  ctx.lineTo(x+20, height-20);
  ctx.stroke(); 
  ctx.fillText("CRASH",x+60,height/2);

  document.getElementById("chart").style.visibility = "visible";
  document.getElementById("phase1").style.left = "3800px";
  document.getElementById("phase2").style.left = "2700px";
}

function setCanvasSize(c,r) {
  c.width = (r-1)*60 + 300;
  c.height = (idTable.length-1)*40 + 180;
}
