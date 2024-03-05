function addToCalendar() {
  // Set the event details
  var eventDetails = {
    title: "Jack & Rose Wedding",
    location: "The Moon & Sixpence",
    description: "Join us for the celebration of love!",
    start: new Date("2024-12-25T14:00:00"), // Use the actual date and time
    end: new Date("2024-12-25T23:00:00"), // Use the actual date and time
  }

  // Create an iCalendar (ICS) file
  var icsFileContent =
    "BEGIN:VCALENDAR\n" +
    "VERSION:2.0\n" +
    "BEGIN:VEVENT\n" +
    "SUMMARY:" +
    eventDetails.title +
    "\n" +
    "LOCATION:" +
    eventDetails.location +
    "\n" +
    "DESCRIPTION:" +
    eventDetails.description +
    "\n" +
    "DTSTART:" +
    formatDate(eventDetails.start) +
    "\n" +
    "DTEND:" +
    formatDate(eventDetails.end) +
    "\n" +
    "END:VEVENT\n" +
    "END:VCALENDAR"

  // Create a Blob containing the ICS content
  var blob = new Blob([icsFileContent], { type: "text/calendar;charset=utf-8" })

  // Create a download link and trigger the click event
  var link = document.createElement("a")
  link.href = window.URL.createObjectURL(blob)
  link.download = "Jack_Rose_Wedding.ics"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

function formatDate(date) {
  return (
    date.getUTCFullYear() +
    ("0" + (date.getUTCMonth() + 1)).slice(-2) +
    ("0" + date.getUTCDate()).slice(-2) +
    "T" +
    ("0" + date.getUTCHours()).slice(-2) +
    ("0" + date.getUTCMinutes()).slice(-2) +
    ("0" + date.getUTCSeconds()).slice(-2) +
    "Z"
  )
}
