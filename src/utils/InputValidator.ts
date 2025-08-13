export class InputValidator {
    public isValidFolderName(name: string): boolean {
        return name.length >= 3 && name.length <= 50;
    }

    public isValidInput(description: string, link: string): boolean {
        return description.length > 0 && this.isValidUrl(link);
    }

    public isValidUrl(url: string): boolean {
        return url.length > 0 && url.includes('.') && !url.includes(' ');
    }
}