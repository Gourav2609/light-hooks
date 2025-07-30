import { usePing } from "light-hooks";

// Basic ping example
export function BasicPingExample() {
  const { latency, isLive, isLoading, lastPingTime } = usePing(
    "https://httpbin.org/status/200"
  );

  return (
    <div style={{ padding: "20px", border: "1px solid #ccc", margin: "10px" }}>
      <h3>Basic Ping Example</h3>
      <p>URL: https://httpbin.org/status/200</p>
      <p>Status: {isLive ? "🟢 Online" : "🔴 Offline"}</p>
      <p>Latency: {latency}ms</p>
      <p>Loading: {isLoading ? "⏳ Pinging..." : "✅ Ready"}</p>
      <p>
        Last ping: {lastPingTime ? lastPingTime.toLocaleTimeString() : "Never"}
      </p>
    </div>
  );
}

// Custom interval ping
export function CustomIntervalPingExample() {
  const { latency, isLive, isLoading } = usePing({
    url: "https://jsonplaceholder.typicode.com/posts/1",
    interval: 10000, // Ping every 10 seconds
    fallbackLatency: 999,
  });

  return (
    <div style={{ padding: "20px", border: "1px solid #ccc", margin: "10px" }}>
      <h3>Custom Interval Ping (2 seconds)</h3>
      <p>URL: jsonplaceholder.typicode.com</p>
      <p>Status: {isLive ? "🟢 Online" : "🔴 Offline"}</p>
      <p>Latency: {latency}ms</p>
      <p>{isLoading && "⏳ Pinging..."}</p>
    </div>
  );
}

// Multiple URL monitoring
export function MultipleUrlPingExample() {
  const google = usePing({ url: "https://www.google.com", interval: 3000 });
  const github = usePing({ url: "https://api.github.com", interval: 3000 });
  const httpbin = usePing({
    url: "https://httpbin.org/status/200",
    interval: 10000,
  });

  const services = [
    { name: "Google", data: google },
    { name: "GitHub API", data: github },
    { name: "HTTPBin", data: httpbin },
  ];

  return (
    <div style={{ padding: "20px", border: "1px solid #ccc", margin: "10px" }}>
      <h3>Multiple URL Monitoring</h3>
      {services.map(({ name, data }) => (
        <div
          key={name}
          style={{
            padding: "10px",
            margin: "5px 0",
            backgroundColor: data.isLive ? "#d4edda" : "#f8d7da",
            borderRadius: "4px",
          }}
        >
          <strong>{name}</strong>
          <span style={{ float: "right" }}>
            {data.isLive ? "🟢" : "🔴"} {data.latency}ms
            {data.isLoading && " ⏳"}
          </span>
        </div>
      ))}
    </div>
  );
}

// Auto-start disabled example
export function ManualPingExample() {
  const { latency, isLive, isLoading, lastPingTime,ping } = usePing({
    url: "https://httpbin.org/delay/1",
    autoStart: false,
    interval: 10000,
  });

  return (
    <div style={{ padding: "20px", border: "1px solid #ccc", margin: "10px" }}>
      <h3>Manual Ping (Auto-start Disabled)</h3>
      <p>URL: httpbin.org/delay/1 (1 second delay)</p>
      <p>Status: {isLive ? "🟢 Online" : "🔴 Offline"}</p>
      <p>Latency: {latency}ms</p>
      <p>Loading: {isLoading ? "⏳ Pinging..." : "✅ Ready"}</p>
      <p>
        Last ping: {lastPingTime ? lastPingTime.toLocaleTimeString() : "Never"}
      </p>
      <button onClick={ping}>Ping</button>
      <p>
        <em>
          Note: This example has autoStart disabled, so it won't ping
          automatically.
        </em>
      </p>
    </div>
  );
}
