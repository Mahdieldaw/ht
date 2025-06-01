import { ModelConnector } from './types';

interface ConnectorEntry {
  connector: ModelConnector;
  priority: number;
}

export class ModelRouter {
  private connectors: Map<string, ConnectorEntry>;
  private roundRobinIndex: number;

  constructor() {
    this.connectors = new Map<string, ConnectorEntry>();
    this.roundRobinIndex = 0;
  }

  public registerConnector(connector: ModelConnector, priority = 0): void {
    this.connectors.set(connector.name, { connector, priority });
    console.log(`Connector "${connector.name}" (${connector.type}) registered with priority ${priority}.`);
  }

  public unregisterConnector(connectorName: string): void {
    this.connectors.delete(connectorName);
  }

  /**
   * Attempts to get a connector by name, falling back to others if unavailable.
   * Priority: 1) requested name, 2) highest priority, 3) round-robin.
   */
  public async getConnector(connectorName?: string): Promise<ModelConnector | undefined> {
    if (connectorName) {
      const entry = this.connectors.get(connectorName);
      if (entry && await entry.connector.isAvailable()) {
        return entry.connector;
      }
    }
    // Fallback: try highest priority available
    const sorted = Array.from(this.connectors.values()).sort((a, b) => b.priority - a.priority);
    for (const entry of sorted) {
      if (await entry.connector.isAvailable()) {
        return entry.connector;
      }
    }
    // Fallback: round-robin
    const all = Array.from(this.connectors.values());
    for (let i = 0; i < all.length; i++) {
      const idx = (this.roundRobinIndex + i) % all.length;
      if (await all[idx].connector.isAvailable()) {
        this.roundRobinIndex = (idx + 1) % all.length;
        return all[idx].connector;
      }
    }
    return undefined;
  }

  public listConnectorNames(): string[] {
    return Array.from(this.connectors.keys());
  }

  public getAllConnectors(): ModelConnector[] {
    return Array.from(this.connectors.values()).map(e => e.connector);
  }

  public async getAvailableConnectors(): Promise<ModelConnector[]> {
    const availableConnectors: ModelConnector[] = [];
    for (const entry of this.connectors.values()) {
      if (await entry.connector.isAvailable()) {
        availableConnectors.push(entry.connector);
      }
    }
    return availableConnectors;
  }
}
