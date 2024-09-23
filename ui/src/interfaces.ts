export interface DesignComponentCardProps {
    imgSrc: string;
    componentName: string;
    tags: string[];
}

export enum SubflowColor {
    GREEN,
    BLUE,
    RED,
    PURPLE,
}

export type Pair<T1, T2> = [T1, T2];