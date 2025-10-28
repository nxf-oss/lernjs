interface DocumentationConfig {
    readonly smoothScroll: boolean;
    readonly copyFeedback: boolean;
    readonly activeSection: boolean;
    readonly backToTop: boolean;
    readonly themeSync: boolean;
    readonly search: boolean;
    readonly tabs: boolean;
    readonly modals: boolean;
    readonly tooltips: boolean;
}
declare class SphinxDocumentation {
    private config;
    private managers;
    private isInitialized;
    constructor(userConfig?: Partial<DocumentationConfig>);
    init(): void;
    private initializeManagers;
    getManager<T>(name: string): T | undefined;
    destroy(): void;
    updateConfig(newConfig: Partial<DocumentationConfig>): void;
}
declare global {
    interface Window {
        SphinxDocs: SphinxDocumentation;
    }
}
export default SphinxDocumentation;
//# sourceMappingURL=index.d.ts.map