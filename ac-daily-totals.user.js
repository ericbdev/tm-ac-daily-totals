// ==UserScript==
// @name            Active Collab daily totals
// @version         1.0.0
// @namespace       ericbdev
// @description     Calculates daily time totals for Active Collab
// @downloadURL     https://github.com/ericbdev/tm-ac-daily-totals/raw/master/ac-daily-totals.user.js
// @include         http*://app.activecollab.com/*/my-time
// @require         https://code.jquery.com/jquery-3.2.1.slim.min.js
// ==/UserScript==

function leftPad(number) {
  return (number < 10 && number >= 0 ? '0' : '') + number;
}

function sum(array) {
  return array.reduce(function (a, b) {
    return a + b;
  });
}

function timePerTasks($timeValues) {
  var hoursWorked = [];
  var minutesWorked = [];

  $timeValues.each(function (key, value) {
    // Convert string to minutes
    var time = $(value).text();
    var timeChunks = time.split(':');

    minutesWorked.push(parseInt(timeChunks[timeChunks.length - 1], 10));
    hoursWorked.push(parseInt(timeChunks[timeChunks.length - 2], 10));
  });

  return {
    hoursWorked: hoursWorked,
    minutesWorked: minutesWorked,
  };
}

function timeTrackedPerDay() {
  var $timeGroups = $('.tracking_objects_list_group');

  if ($timeGroups.length) {
    $timeGroups.each(function (key, value) {
      var $group = $(value);
      var $timeValues = $group.find('[data-qa-id="time-record-value"]');
      var $groupHeader = $group.find('[data-qa-id="date-tracking-value"]');

      if (!$groupHeader.data('backup-text')) {
        $groupHeader.data('backup-text', $groupHeader.text());
      }

      var groupHeaderText = $groupHeader.data('backup-text');

      var _timePerTasks = timePerTasks($timeValues);

      var hoursWorked = _timePerTasks.hoursWorked;
      var minutesWorked = _timePerTasks.minutesWorked;

      var totalHoursPerDay = sum(hoursWorked);
      var totalMinutesPerDay = sum(minutesWorked);

      var totalMinutes = totalHoursPerDay * 60 + totalMinutesPerDay;
      var hoursOfDay = leftPad(Math.floor(Math.abs(totalMinutes) / 60));
      var minutesOfDay = leftPad(Math.abs(totalMinutes) % 60);

      $groupHeader.text(groupHeaderText + ' - ' + hoursOfDay + ':' + minutesOfDay);
    });
  }
}

$(function() {
  timeTrackedPerDay();

  setInterval(function () {
    timeTrackedPerDay();
  }, 1000);
});
