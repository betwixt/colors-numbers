import React, { Component } from 'react';
import './App.css';

class App extends Component {

  constructor(){
    super();
    // default target will be today
    var now = new Date();
    this.state = {
      month: 1,  // user-selected value for month
      daynum: 1,     // user-selected value for date
      tDate: now,
      displayNum: 0,
      weekStart: now,
      weekActive: false,
      weekColors: [],
      weekSelection: new Array(7).fill(false),
    }

    this.colorMap = new Map();
    this.colorMap.set(0, {title: "A Color", bg: "gray", desc: "======="});
    this.colorMap.set(1, {title: "Red", bg: "red", desc: "Feel great!"});
    this.colorMap.set(2, {title: "Orange", bg: "orange", desc: "Feel great!"});
    this.colorMap.set(3, {title: "Yellow", bg: "gold", desc: "Feel great!"});
    this.colorMap.set(4, {title: "Green", bg: "green", desc: "Feel great!"});
    this.colorMap.set(5, {title: "Blue", bg: "blue", desc: "Feel great!"});
    this.colorMap.set(6, {title: "Indigo", bg: "indigo", desc: "Feel great!"});
    this.colorMap.set(7, {title: "Purple / Violet", bg: "purple", desc: "Feel great!"});
    this.colorMap.set(8, {title: "Pink / Beige / Brown", bg: "hotpink", desc: "Feel great!"});
    this.colorMap.set(9, {title: "Pastels", bg: "powderblue", desc: "Feel great!"});
    this.colorMap.set(11, {title: "Black / White", bg: "black", desc: "Feel great!"});
    this.colorMap.set(22, {title: "Coral / Russet", bg: "coral", desc: "Feel great!"});


    this.initialTarget = new Date(+now - now.getTimezoneOffset() * 60 * 1000).toISOString().slice(0,10);
    console.log("Init target is " + this.initialTarget);

    // These statements are needed to allow passing functions as props 
    this.setMonthSelection = this.setMonthSelection.bind(this);
    this.setWeekSelection = this.setWeekSelection.bind(this);
    this.setDaySelection = this.setDaySelection.bind(this);
    this.showTodayColor = this.showTodayColor.bind(this);
    this.showTargetDayColor = this.showTargetDayColor.bind(this);
    this.showTargetWeek = this.showTargetWeek.bind(this);
    this.setColorToDisplay = this.setColorToDisplay.bind(this);

    this.personalDay = 0;
    this.personalMonth = 0;
    this.personalYear = 0
  }



// MAIN drawing routine for entire page
  render() {

    var today = new Date().toDateString();

    return (
      <div className="App">
        <div className="App-header">
          <h1>Colors and Numbers </h1>
          <h3>Calculate your Personal Color of the Day </h3>
        </div>

        <div id="top">
        <div id="controls">
            <p className="instructions">
	        Please enter the month and day of your birthday: </p>
            <div>
                <MonthChooser  setResult={this.setMonthSelection} />
                <NumChooser setResult={this.setDaySelection} 
                            month={this.state.month} />
            </div>
            <div id="today-section">
                <h3 id="today"> Today is: </h3>
                <p> {today}  </p>
                <button  onClick={this.showTodayColor} >
                     SHOW MY COLOR!
                </button>
            </div>
            <div id="choosing">
                <p>  Choose a Day:  </p>
                <input type="date" 
                       defaultValue = {this.initialTarget}
                       onChange={this.setTargetDay.bind(this) } />
                <button className="pickDay"  onClick={this.showTargetDayColor} >
                    MY COLOR for this Day
                </button>
            </div>
            <div id="bar">
                <button  onClick={this.showTargetWeek}>
                    MY COLORS for a Week
                </button>
                <WeekBar colorNums={this.state.weekColors}
                     colorInfo={this.colorMap}
                     startDay={this.state.weekStart}
                     setResult={this.setColorToDisplay}
                     items={this.state.weekSelection}
                     setWeekday={this.setWeekSelection}
                     active={this.state.weekActive} />
            </div>
        </div>

        <ColorPane colorInfo={this.colorMap}
                   colorNum={this.state.displayNum}  />


        </div>

      </div>
    );
  }

  // Action in Months component
  /* TODO: When a month is selected, some calendar days may need to be grayed out */
  setMonthSelection(val) {
    this.setState({month: val});
    console.log("Selected month was set to " + val);
  }

  // Action in Numbers component (date of bday)
  setDaySelection(val) {
    this.setState({daynum: val});
    console.log("Selected day was set to " + val);
  }

  // Action in BarSquare component, to change ColorPane
  setColorToDisplay(num) {
    this.setState({displayNum: num});
    // console.log("Selected display color was set to " + num);
  }

  // Change which element is selected in WeekBar, also can be executed by 
  // BarSquare component
  setWeekSelection(i) {
    const items = Array(7).fill(false);
    items[i] = true;

    this.setState({weekSelection: items});
  }

  // Action executed in component for target date
  setTargetDay(e) {
    var datestr = e.target.value;
    // Form of input - yyyy-mm-dd
    console.log(datestr);

    // Parse string to get tmonth, tdate and tyear, then set state
    var y = datestr.slice(0,4);
    var m = datestr.slice(5,7)
    var d = datestr.slice(8)

    var aDate = new Date(y, m-1, d);
    this.setState({
      tDate: aDate,
      weekActive: false
    });

    console.log("In setTargetDay, aDate is " + aDate.toDateString());
  }

  // utility function, may go away
  targetDateString() {
    var targ =  this.state.tDate.toDateString();
    // console.log ("App sees target date is: " + targ);
    return targ;
  }

  displayColorForTarget(aDate) {

    var bmonth = this.state.month;
    var bdate = this.state.daynum;

    var m = aDate.getMonth() + 1;
    var d = aDate.getDate();
    var y = aDate.getFullYear();
   

    console.log("Calling calculate with " + aDate.toDateString() );
    this.calculate( bmonth, bdate, m, d, y );

    var output = "Your personal year is " + this.personalYear 
      + ( "\nYour personal month is: " + this.personalMonth )
      + ("\n\nFor the date:  " + this.targetDateString()
      + ", your personal color is: " 
        + this.colorMap.get(this.personalDay).title )
    // alert(output);
    console.log(output);

    this.setState({displayNum: this.personalDay});
    //var c = getColorInfo(this.personalDay);
  }

  getColorInfo(aNum) {
    return this.colorMap.get(aNum);
  }


  showTodayColor() {

    // Target will be today
    // var now = new Date();
    // var targetMonth = now.getMonth() + 1;
    // var targetDay = now.getDate();
    // var thisYear = now.getFullYear();

    this.displayColorForTarget(new Date());
  }


  showTargetDayColor() {

    this.displayColorForTarget(this.state.tDate);
  }


  // Display a row of 7 buttons. Labels display the day-of-week and calendar 
  // day, plus color for that day. When button is clicked, show 
  // matching color and description in colorPane
  showTargetWeek() {

    var aDate = new Date( this.state.tDate.getTime() );
    var bmonth = this.state.month;
    var bdate = this.state.daynum;

    /* Calculate colors for 7 successive days, set state that's seen by WeekBar */
    var colors = [];
    for (var i=0; i< 7; i++) {
        this.calculate(bmonth, bdate, aDate.getMonth()+1, aDate.getDate(), aDate.getFullYear())
        colors.push(this.personalDay);

        /* increment to next day */
        aDate.setTime(aDate.getTime() + 86400000);
    }
    console.log("Colors array is: " + colors.toString());

    this.showTargetDayColor();

    const items = Array(7).fill(false);
    items[0] = true;
    this.setState({
        weekStart: this.state.tDate,
        weekColors: colors,
        weekActive: true,
        weekSelection: items
    });

  }

  //==========================================================================
  //  Calculation methods


  // Generalized method for calculating personal day
  // Inputs: bmonth, bdate, targMonth, targDate, targYear
  // Outputs: numbers for personal day, month and year

  calculate( bmonth, bdate, targMonth, targDate, targYear) {

    var univYear = this.reduceDigits( targYear ) ;
    this.personalYear = this.reduceDigits( this.reduceBirthNums(bmonth, bdate) + univYear );
    this.personalMonth = this.reduceDigits ( this.personalYear + this.reduceDigits(targMonth) );
    this.personalDay = this.reduceForPersonalDay(this.personalMonth, targDate)
    console.log("Calculated personal day: " + this.personalDay);

  }

  reduceDigits(num) {
     var digitsum = 0;  
     var numstr = num.toString();
     for (var i = 0; i < numstr.length; i++) {
          digitsum +=  parseInt(numstr[i]);
     }
     if ( digitsum === 0 ) {
        // print error or throw exception?
     } else if ( digitsum > 9 ) {
       return this.reduceDigits (digitsum)
     } else {
	   return digitsum;
     }
		
  }

  reduceBirthNums(m, d) {
     return this.reduceDigits(m) + this.reduceDigits(d)
  }


  // When calculating personal day, check for special cases, sum is 11 or 22
  // Note: pMon arg is already reduced
  reduceForPersonalDay(pMon, d){
     var dayValue = this.reduceDigits(d) + pMon;
     if (dayValue < 10 || dayValue === 11 || dayValue === 22) {
        return dayValue;
     } else {
        return this.reduceDigits(dayValue);
     }
  }
  //==========================================================================
  
}
export default App;



// Square - Expected props:
//   * value - my label
//   * clickAction - closure, sent from above, to record the user's choice
//   * highlight - boolean, do I render the highlight effect?
//   * disabled - boolean, do I gray out
class Square extends React.Component {

  render() {

    // Here, implement the highlight effect - decide what later
    if (this.props.highlight) {
      return (
          <button 
                style={{backgroundColor : "lightsteelblue"}}
                className="square" 
                onClick={() => this.props.clickAction()}  > 
             {this.props.value}
          </button>
      );
    }

	if (this.props.disabled) {
	  return (
          <button 
                style={{color: "gray"}}
				disabled={true}
                className="square" 
                onClick={() => this.props.clickAction()}  > 
             {this.props.value}
          </button>
      );
	}
    return (
          <button  
                className="square" 
                onClick={() => this.props.clickAction()} >
             {this.props.value}
          </button>
    );
  }
}



// MonthChooser - Expected props:  
//   *setResult  - closure from parent to record the user's choice
class MonthChooser extends React.Component {

  constructor(){
      super();
      let sq = Array(12).fill(false);
      sq[0] = true;
      this.state = {
        squares: sq,
        months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                 "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ]
      }
  }

  /* Updating selection has to include removing the old selection */
  setSelection(i) {
    const squares = Array(12).fill(false);
    squares[i] = true;

    this.setState({squares: squares});
    this.props.setResult(i+1);  // Number value for month
  }

  renderSquare(i) {
      return <Square value={this.state.months[i]} 
                     clickAction={() => this.setSelection(i)} 
                     disabled={false}
                     highlight={this.state.squares[i]}  />;
  }

  render() {  
      return (
           <div className="months">
             <div className="board-row">
                {this.renderSquare(0)}
                {this.renderSquare(1)}
                {this.renderSquare(2)}
                {this.renderSquare(3)}
              </div>
              <div className="board-row">
                {this.renderSquare(4)}
                {this.renderSquare(5)}
                {this.renderSquare(6)}
                {this.renderSquare(7)}
              </div>
              <div className="board-row">
                {this.renderSquare(8)}
                {this.renderSquare(9)}
                {this.renderSquare(10)}
                {this.renderSquare(11)}
              </div>
           </div>
      );
  }
}


// NumChooser - Expected props:  
//   *setResult  - closure from parent to record the user's choice
//   *month - month currently chosen by user
class NumChooser extends React.Component {

  constructor(){
    super();
    let sq = Array(12).fill(false);
    sq[0] = true;
    this.state = {
      squares: sq
    }
    this.daysInMonth = new Map();
    this.daysInMonth.set(1, 31);
    this.daysInMonth.set(2, 29);
    this.daysInMonth.set(3, 31);
    this.daysInMonth.set(4, 30);
    this.daysInMonth.set(5, 31);
    this.daysInMonth.set(6, 30);
    this.daysInMonth.set(7, 31);
    this.daysInMonth.set(8, 31);
    this.daysInMonth.set(9, 30);
    this.daysInMonth.set(10, 31);
    this.daysInMonth.set(11, 30);
    this.daysInMonth.set(12, 31);
  }

  // Updating selection has to include removing the old selection 
  // Before actual selection occurs, validate argument 'i' against the
  // month that's currently selected. **TODO**
  setSelection(i) {
    const squares = Array(31).fill(false);
    squares[i] = true;

    this.setState({squares: squares});
    this.props.setResult(i+1);
  }



  renderSquare(i) {
    var isDisabled = i > this.daysInMonth.get(this.props.month) - 1

    return <Square value={i + 1} 
                   clickAction={() => this.setSelection(i)} 
                   highlight={isDisabled ? false : this.state.squares[i]}  
                   disabled={isDisabled}
           />;
  }

  renderNumberRow(start, end){
    var row = [];
    for (var i=start; i<=end; i++) {

       row.push(this.renderSquare(i)); 
    }
    return row;
  }

  render() {

    return (
           <div className="nums">
              <div className="board-row">
                {this.renderNumberRow(0,6)}
              </div>
              <div className="board-row">
                {this.renderNumberRow(7,13)}
              </div>
              <div className="board-row">
                {this.renderNumberRow(14,20)}
              </div>
              <div className="board-row">
                {this.renderNumberRow(21,27)}
              </div>
              <div className="board-row">
                {this.renderNumberRow(28,30)}
              </div>
            </div>
      );
  }
}


// ColorPane - Expected props:
//   *colorNum
//   *colorInfo - mapping from  number to display information
class ColorPane extends React.Component {

  constructor(){
      super();
  }

  render() {

    var c = this.props.colorInfo.get(this.props.colorNum);
    var title = c.title;
    var desc = c.desc;
    var bg = c.bg;

    var paneStyle = { backgroundColor: bg };
    return(

        <div id="colorPane" style={paneStyle} >
            <h2> {title} </h2>
            <p> 
                This is where we will say interesting things about what the color stands for!!!!
            </p>
            <p> And have a nice background image :-D </p>
            <p> {desc} </p>
        </div>
    );
  }

}

// WeekBar - Expected props:  
//   *startDay - Date for first day in the bar
//   *colorNums - array of color numbers for successive days
//   *colorInfo - map of number to display information
//   *active - whether or not to display
//   *items - array representing item selection
//   *setWeekday - closure from parent to update which Day (square) is selected
//   *setResult  - closure from parent to change contents of ColorPane
//
class WeekBar extends React.Component {

  constructor(){
      super();

  }


  render() {

    var cstring;
    if (! this.props.active) 
       return(
           <div className="barhide">  </div>
    );
    

    // Each item holds info: date num, day-of-week, colorNum
    var dayInfo = []   ;
    var element, num, name;
    var dayObj = new Date( this.props.startDay.getTime() );

    for (let n=0; n<7; n++) { 

      num = this.props.colorNums[n];
      name = this.props.colorInfo.get(num).title;
      /* Check for the titles that are too long, abbreviate */
      if (num == 8) { name = "Pink / Brown"; }


      element = <BarSquare
                    setColor={this.props.setResult}
                    setChoice={() => this.props.setWeekday(n)}
                    highlight={this.props.items[n]}
                    dayName={dayObj.toDateString().slice(0,3).toUpperCase()}
                    dayNum={dayObj.getDate()}
                    colorName={name}
                    colorNum={num}   />
      dayInfo.push(element);
      
      /* increment to next day */
      dayObj.setTime(dayObj.getTime() + 86400000);

    }
    return ( 
        <div className="baractive"> 
            {dayInfo}
        </div> 
    );

  }
}


// BarSquare - Expected props:  
//   *setColor - closure from App to set contents of ColorPane
//   *setChoice - closure from WeekBar to set item selection
//   *highlight - boolean of whether to highlight square
//   *dayName - day of week
//   *dayNum - calendar day
//   *colorNum - number to set contents of ColorPane
//
class BarSquare extends React.Component {

  constructor(){
      super();
  }

  doClickAct() {
    this.props.setColor(this.props.colorNum);
    this.props.setChoice();
  }

  render() {
    var c;
    if (this.props.highlight)  
       c = "barselect";
    else
       c = "barsq"

    return (
        <div onClick={() => this.doClickAct()} className={c}>
            <p className="weekday"> {this.props.dayName} </p>
            <p className="calnum"> {this.props.dayNum} </p>
            <p className="sqtext"> {this.props.colorName} </p>
        </div>
    );

  }
}
