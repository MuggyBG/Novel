
export const sanitizeContentForJSON = (content) => {
    if (typeof content !== 'string') {
        return String(content);
    }
    return content;
};
export const isContentJSONSafe = (content) => {
    try {
        const testObject = { content };
        const stringified = JSON.stringify(testObject);
        const parsed = JSON.parse(stringified);
        return parsed.content === content;
    } catch (e) {
        console.error('Content is not JSON safe:', e);
        return false;
    }
};

export const escapeSpecialChars = (content) => {
    if (typeof content !== 'string') {
        return content;
    }
    
    return content
        .replace(/\\/g, '\\\\')      
        .replace(/"/g, '\\"')         
        .replace(/\n/g, '\\n')       
        .replace(/\r/g, '\\r')        
        .replace(/\t/g, '\\t');      
};


export const unescapeSpecialChars = (content) => {
    if (typeof content !== 'string') {
        return content;
    }
    
    return content
        .replace(/\\t/g, '\t')       
        .replace(/\\r/g, '\r')       
        .replace(/\\n/g, '\n')       
        .replace(/\\"/g, '"')         
        .replace(/\\\\/g, '\\');      
};


export const createSafeChapterPayload = (chapterData) => {
    return {
        ...chapterData,
        content: sanitizeContentForJSON(chapterData.content),
    };
};
