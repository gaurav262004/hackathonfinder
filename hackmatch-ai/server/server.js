app.get("/test-db", async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;

    res.send({
      status: dbState === 1 ? "Connected" : "Not Connected",
      state: dbState
    });
  } catch (err) {
    res.send(err.message);
  }
});