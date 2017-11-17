export interface IRenderable {
    render(): void;
}

export interface IRedrawable extends IRenderable {
    update(): void;
}