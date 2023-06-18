var Layout = require("Layout");
let countdownIntervalId = null;
var totalMinutes;
var remainingSeconds;
var rootLayout;


function startCountdown(setTime) {
  g.clear();
  totalMinutes = setTime;
  remainingSeconds = totalMinutes * 60;
  if (countdownIntervalId !== null) {
    console.log('Countdown is already running');
    return;
  }
  
  console.log('Countdown started');
  countdownIntervalId = setInterval(decrementTime, 1000);
  Bangle.buzz();
}

function reset() {
    remainingSeconds = 0;
    stopCountdown();
    rootLayout = new Layout(
    {
      type: "h", // Horizontal layout
      pad: 5, // Gap between buttons
      c: [
        // First column
        {
          type: "v", // Vertical layout
          pad: 5, // Gap between buttons
          c: [
            { type: "btn", label: "1",  cb: function() {startCountdown(1);}, pad: 5, fillx: 1, filly: 1 },
            { type: "btn", label: "10", cb: function() {startCountdown(10);}, pad: 5, fillx: 1, filly: 1 },
            { type: "btn", label: "30", cb: function() {startCountdown(30);}, pad: 5, fillx: 1, filly: 1 }
          ]
        },
        // Second column
        {
          type: "v", // Vertical layout
          pad: 5, // Gap between buttons
          c: [
            { type: "btn", label: "5", cb:  function() {startCountdown(5);}, pad: 5, fillx: 1, filly: 1 },
            { type: "btn", label: "20", cb: function() {startCountdown(20);}, pad: 5, fillx: 1, filly: 1 },
            { type: "btn", label: "60", cb: function() {startCountdown(60);}, pad: 5, fillx: 1, filly: 1 }
          ]
        }
      ]
    },
    { lazy: true }
  );

  g.clear();
  rootLayout.render();
  g.flip();
}

function continueCountDown(){
  if (remainingSeconds > 0)
  {
    g.clear();
    countdownIntervalId = setInterval(decrementTime, 1000);
  }
}

function stopCountdown() {
  if (countdownIntervalId === null) {
    console.log('Countdown is not running');
    continueCountDown();
    Bangle.buzz();
    return;
  }

  clearInterval(countdownIntervalId);
  countdownIntervalId = null;
  console.log('Countdown stopped');
  Bangle.buzz();
  g.clear();
  rootLayout = new Layout({
                    type: "v",
                    c: [
                      // Countdown animation
                      {
                        type: "custom",
                        render: CountdownAnimation,
                        id: "countdown",
                        fillx: 1,
                        filly: 1,
                        pad: 10
                      },
                      // Start and stop buttons
                      {
                        type: "h",
                        c: [
                          { type: "btn", label: "Reset", id: "resetBtnID", cb: function() { reset(); }, pad: 5 },
                          { type: "btn", label: "Cont.", id: "pauseBtnID", cb: function() { stopCountdown(); }, pad: 5 }
                        ]
                      }
                    ]
                  });
    rootLayout.render();
}

function decrementTime() {
  if (remainingSeconds > 0) {
    remainingSeconds--;
    rootLayout = new Layout({
                    type: "v",
                    c: [
                      // Countdown animation
                      {
                        type: "custom",
                        render: CountdownAnimation,
                        id: "countdown",
                        fillx: 1,
                        filly: 1,
                        pad: 10
                      },
                      // Start and stop buttons
                      {
                        type: "h",
                        c: [
                          { type: "btn", label: "Reset", id: "resetBtnID", cb: function() { reset(); }, pad: 5 },
                          { type: "btn", label: "Pause", id: "pauseBtnID", cb: function() { stopCountdown(); }, pad: 5 }
                        ]
                      }
                    ]
                  });
    rootLayout.render(); // Re-render the layout to update the countdown animation
  } else {
    stopCountdown();
  }
}

function drawScreen(message, clearScreen) {
  if (clearScreen) g.clear();
  g.setFontAlign(0, 0);
  g.setFont('Vector', 15); // Set font to a smaller size
  g.drawString(message, g.getWidth() / 2, (g.getHeight() / 2)-20);
  g.flip();
}

// Create the custom element for the countdown animation
function CountdownAnimation(l) {
  const screenWidth = g.getWidth();
  const screenHeight = g.getHeight();
  const centerX = (screenWidth / 2);
  const centerY = (screenHeight / 2)-20;
  const radius = Math.min(screenWidth, screenHeight) / 2 - 40;

  g.clearRect(l.x, l.y, l.x + l.w - 1, l.y + l.h - 1);

  // Draw the clock face
  g.setColor("#ffffff");
  g.fillCircle(centerX, centerY, radius);
  g.setColor("#000000");
  g.drawCircle(centerX, centerY, radius);

  // Calculate the angle based on remaining seconds
  const angle = (2 * Math.PI * remainingSeconds) / (totalMinutes * 60);

  // Draw the countdown progress arc
  g.setColor("#ff0000");
  for (let r = 0; r < angle; r += 0.01) {
    const x = centerX + Math.sin(r) * radius;
    const y = centerY - Math.cos(r) * radius;
    g.drawCircle(x, y, 1);
  }
  
  // Now draw the formated time in the middle of our circle
  const mins = Math.floor(remainingSeconds / 60);
  const secs = remainingSeconds % 60;
  const formattedTime = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  drawScreen(formattedTime, false);
  g.flip();
}

reset();
