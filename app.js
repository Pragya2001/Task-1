const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const events = [];

// middleware
app.use(bodyParser.json());

// GET /api/v3/app/events?id=:event_id
app.get('/api/v3/app/events', (req, res) => {
  const event_id = req.query.id;
  const event = events.find(event => event.uid === event_id);

  if (!event) {
    res.status(404).json({ error: 'Event not found' });
  } else {
    res.json(event);
  }
});

// GET /api/v3/app/events?type=latest&limit=5&page=1
app.get('/api/v3/app/events', (req, res) => {
  const { type, limit, page } = req.query;
  const filteredEvents = events.filter(event => event.type === type);
  const pageEvents = filteredEvents.slice((page - 1) * limit, page * limit);

  res.json(pageEvents);
});

// POST /api/v3/app/events
app.post('/api/v3/app/events', (req, res) => {
  const { name, tagline, schedule, description, moderator, category, sub_category, rigor_rank } = req.body;
  const newEvent = {
    uid: Math.random().toString(36).substr(2, 9),
    type: 'event',
    name,
    tagline,
    schedule,
    description,
    moderator,
    category,
    sub_category,
    rigor_rank,
    attendees: []
  };

  events.push(newEvent);
  res.json({ id: newEvent.uid });
});

// PUT /api/v3/app/events/:id
app.put('/api/v3/app/events/:id', (req, res) => {
  const { id } = req.params;
  const event = events.find(event => event.uid === id);

  if (!event) {
    res.status(404).json({ error: 'Event not found' });
  } else {
    const { name, tagline, schedule, description, moderator, category, sub_category, rigor_rank } = req.body;
    event.name = name || event.name;
    event.tagline = tagline || event.tagline;
    event.schedule = schedule || event.schedule;
    event.description = description || event.description;
    event.moderator = moderator || event.moderator;
    event.category = category || event.category;
    event.sub_category = sub_category || event.sub_category;
    event.rigor_rank = rigor_rank || event.rigor_rank;
    res.json({ id: event.uid });
  }
});

// DELETE /api/v3/app/events/:id
app.delete('/api/v3/app/events/:id', (req, res) => {
  const { id } = req.params;
  const index = events.findIndex(event => event.uid === id);

  if (index === -1) {
    res.status(404).json({ error: 'Event not found' });
  } else {
    events.splice(index, 1);
    res.json({ success: true });
  }
});

app.listen(3000, () => console.log('Server is running on port 3000'));
