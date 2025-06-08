export class Fic {
    id: number;
    title: string;
    description: string;
    tags: string[];

    constructor() {
        this.id = 0;
        this.title = '';
        this.description = '';
        this.tags = [];
    }
}
