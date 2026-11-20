// Punkt wejścia Workera: Astro + EmDash (Durable Objects i zadania cykliczne panelu).
import handler, { createScheduledHandler, EmDashRoom, EmDashRoomSite, PluginBridge } from '@emdash-cms/cloudflare/worker';

export { EmDashRoom, EmDashRoomSite, PluginBridge };

export default {
  ...handler,
  scheduled: createScheduledHandler(),
} satisfies ExportedHandler;
