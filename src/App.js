import React from 'react';
import './App.css';
import interact from 'interactjs'

class App extends React.Component {

  componentDidMount() {

    const src1Dot = document.getElementById('src1Dot');
    const src2Dot = document.getElementById('src2Dot');
    const src3Dot = document.getElementById('src3Dot');
    const src4Dot = document.getElementById('src4Dot');

    const target1Dot = document.getElementById('target1Dot');
    const target2Dot = document.getElementById('target2Dot');
    const target3Dot = document.getElementById('target3Dot');
    const target4Dot = document.getElementById('target4Dot');

    let srcAndTarget = {target: null, src: null, direction : null};
    let dotpairs = [];
    let sourcesAndTargets = [src1Dot,src2Dot,src3Dot,src4Dot,target1Dot,target2Dot,target3Dot,target4Dot];

    let draggableInput = ['#src1', '#src2', '#src3', '#src4', '#target1', '#target2', '#target3', '#target4'];
    let resetPosition = ['src1', 'src2', 'src3', 'src4', 'target1', 'target2', 'target3', 'target4'];
    let resetText = ['src1Input', 'src2Input', 'src3Input', 'src4Input', 'target1Input', 'target2Input', 'target3Input', 'target4Input'];

    //stock data from input
    sourcesAndTargets.forEach(element =>
      element.addEventListener('click', (event) => {

        let _element = event.target;
        let type = _element.dataset.type;
        let num = _element.dataset.number;

        document.getElementById(`${type}${num}Input`).focus();

        srcAndTarget[type] = num;

        if (srcAndTarget.src && srcAndTarget.target){
          // last type for arrow direction
          srcAndTarget["direction"] = type;
          dotpairs.push(srcAndTarget);
          //reset srcAndTarget
          srcAndTarget = {target: null, src: null, direction: null};

          drawArrows()
        }
      })
    );

    //onresize sizescreen 
    window.addEventListener("resize", () => {
      
      setTimeout(function(){
        const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0) -1;
        document.getElementById('svgzone').setAttribute("style","height:"+vh+"px");
        //update arrow
        drawArrows()
      }, 100);
      }
    )

    //function svg arrow
    function drawArrows(){
    
    let arrow_marker_black = "<defs><marker id='arrow_black' markerWidth='10' markerHeight='10' refX='+10' refY='3' orient='auto' markerUnits='strokeWidth'><path d='M0,0 L0,6 L9,3 z' fill='#000' /></marker></defs>";
    let arrow_marker_black2 = "<defs><marker id='arrow_black2' markerWidth='10' markerHeight='10' refX='+10' refY='3' orient='auto' markerUnits='strokeWidth'><path d='M0,0 L0,6 L9,3 z' fill='#000' /></marker></defs>";
    //html to inject
    let html = "";
    
      for (let i in dotpairs){
        
        let rect = document.getElementById("target"+dotpairs[i]["target"]+"Dot").getBoundingClientRect();
        // /2 to have the center of the point 
        let targetx = rect.x + rect.width/2 + window.pageXOffset
        let targety = rect.y + rect.height/2 + window.pageYOffset;
        rect = document.getElementById("src"+dotpairs[i]["src"]+"Dot").getBoundingClientRect();
        let sourcex = rect.x + rect.width/2 + window.pageXOffset
        let sourcey = rect.y + rect.height/2 + window.pageYOffset;
        
      if (dotpairs[i]["direction"] === "target")
        html += "<line x1='"+sourcex+"' y1='"+sourcey+"' x2='"+targetx+"' y2='"+targety+"' style='stroke:rgb(0,0,0);stroke-width:2' marker-end='url(#arrow_black)'/>";
          else
        html += "<line x1='"+targetx+"' y1='"+targety+"' x2='"+sourcex+"' y2='"+sourcey+"' style='stroke:rgb(0,0,0);stroke-width:2' marker-end='url(#arrow_black2)'/>";			    
      }
      
      let svgdraw = document.getElementById("svgdraw");
      svgdraw.innerHTML = arrow_marker_black + arrow_marker_black2 + html;    
    }	

    //full reset
    document.getElementById('btnReset').addEventListener('click', () => {
      document.getElementById("svgdraw").innerHTML = "";
      dotpairs = [];

      resetPosition.forEach(element => {
        document.getElementById(element).style.webkitTransform = 'translate(' + 0 + 'px, ' + 0 + 'px)';
        document.getElementById(element).style.transform = 'translate(' + 0 + 'px, ' + 0 + 'px)';
        document.getElementById(element).setAttribute('data-x', 0);
        document.getElementById(element).setAttribute('data-y', 0);
      });

      resetText.forEach(element => {
        document.getElementById(element).value = "";
      })
    })
  
    
    //function drag

    draggableInput.forEach(element => 
      
      interact(element)
        .draggable({
          onmove: dragMoveListener,
          inertia: true,
          modifiers: [
            interact.modifiers.restrict({
              restriction: 'parent',
              endOnly: true
            })
          ]         
        }).resizable({
        inertia: {
          resistance: 30,
          minSpeed: 200,
          endSpeed: 100
        }
      })
    );

    function dragMoveListener (event) {
      let target = event.target,
      // keep the dragged position in the data-x/data-y attributes
      x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
      y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
  
      // translate the element
      target.style.webkitTransform = 'translate(' + x + 'px, ' + y + 'px)';
      target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
  
      // update the position attributes
      target.setAttribute('data-x', x);
      target.setAttribute('data-y', y);

      drawArrows();
    }

    //screen size
    setTimeout(function(){
      const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0) -1;
      document.getElementById('svgzone').setAttribute("style","height:"+vh+"px");
    }, 100);
  }

  render() {
    return (
      
      <div className="App">
        <div className="container">
            <div id="svgzone">
			        <svg id="svgdraw"></svg>
		        </div>
            <div className="workforce">ÉQUIPE DE NETTOYAGE</div>
            <div className="task">TÂCHES</div>
            <div className="background-workforce"></div>
            <div className="background-task"></div>
            <div className="footer"><button className="btn" id="btnReset">RESET</button></div>
            <div className="container-src tic">
              <form className="form" autoComplete="off">
                <div id="src1" data-type="src" data-number="1">
                  <input id="src1Input" type="text" className="form-field dot input-src one" placeholder="Écrire ici" />
                  <div id="src1Dot" className="dot-src one" data-type="src" data-number="1"></div>
                </div>
                <div id="src2" data-type="src" data-number="2">
                  <input id="src2Input" type="text" className="form-field dot input-src two" placeholder="Écrire ici" />
                  <div id="src2Dot" className="dot-src two" data-type="src" data-number="2"></div>
                </div>
                <div id="src3" data-type="src" data-number="3">
                  <input id="src3Input" type="text" className="form-field dot input-src three" placeholder="Écrire ici" />
                  <div id="src3Dot" className="dot-src three" data-type="src" data-number="3"></div>
                </div>
                <div id="src4" data-type="src" data-number="4">
                  <input id="src4Input" type="text" className="form-field dot input-src four" placeholder="Écrire ici" />
                  <div id="src4Dot" className="dot-src four" data-type="src" data-number="4"></div>
                </div>
              </form>
            </div>

            <div className="container-target">
              <form className="form" autoComplete="off">
                <div id="target1" data-type="target" data-number="1">
                  <div id="target1Dot" className="dot-target one" data-type="target" data-number="1"></div>
                  <input id="target1Input" type="text" className="form-field dot input-target one" placeholder="Écrire ici" />
                </div>
                <div id="target2" data-type="target" data-number="2">
                  <div id="target2Dot" className="dot-target two" data-type="target" data-number="2"></div>
                  <input id="target2Input" type="text" className="form-field dot input-target two" placeholder="Écrire ici" />
                </div>
                <div id="target3" data-type="target" data-number="3">
                  <div id="target3Dot" className="dot-target three" data-type="target" data-number="3"></div>
                  <input id="target3Input" type="text" className="form-field dot input-target three" placeholder="Écrire ici" />
                </div>
                <div id="target4" data-type="target" data-number="4">
                  <div id="target4Dot" className="dot-target four" data-type="target" data-number="4"></div>
                  <input id="target4Input" type="text" className="form-field dot input-target four" placeholder="Écrire ici" />
                </div>
              </form>
            </div>
        </div>
      </div>
    );
  }
}

export default App;
