
const date = "2026-05-10";
const startTime = "05:10"; // 10 mins after the user's current time (04:57)
const now = new Date("2026-05-10T04:57:52+01:00");

console.log("Current Time (Local):", now.toString());
console.log("Current Time (ISO):", now.toISOString());

const appointmentStart = new Date(`${date}T${startTime}`);
console.log("Appointment Start (Parsed):", appointmentStart.toString());

const openAt = new Date(appointmentStart.getTime() - 10 * 60 * 1000);
console.log("Open At:", openAt.toString());

const canJoin = now >= openAt;
console.log("Can Join:", canJoin);
