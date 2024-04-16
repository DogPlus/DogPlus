from datetime import datetime, timedelta

def generate_possible_timeslots(start_time, end_time, interval):
    timeslots = []
    current_time = start_time
    while current_time < end_time:
        timeslots.append(current_time.time())
        current_time += timedelta(minutes=interval)
    return timeslots

def filter_out_unavailable_timeslots(bookings, timeslots):
    available_timeslots = []
    for timeslot in timeslots:
        is_booked = any(
            booking[0] <= timeslot < booking[1] for booking in bookings
        )
        if not is_booked:
            available_timeslots.append(timeslot.strftime('%H:%M'))
    return available_timeslots
