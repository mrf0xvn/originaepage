export function resolveSectionHref(currentPath: string, sectionId: string) {
    return currentPath === "/" ? `#${sectionId}` : `/#${sectionId}`;
}
