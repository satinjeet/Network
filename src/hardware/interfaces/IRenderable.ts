export interface IRenderable {
    inst: Snap.Element;
    render(): void;
}

export interface IRedrawable extends IRenderable {
    update(): void;
}