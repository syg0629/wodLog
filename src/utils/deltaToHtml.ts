import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";

interface DeltaContent {
  content: string;
}

// JSON을 파싱하고 Delta 형식 검증
const parseDeltaContent = (content: string) => {
  try {
    const parsedContent = JSON.parse(content);
    if (parsedContent && Array.isArray(parsedContent.ops)) {
      return parsedContent.ops;
    } else {
      console.log("유효하지 않은 delta fomat >> ", content);
    }
  } catch (error) {
    console.log("JSON 파싱 시 오류 >> ", content, error);
  }
  return null;
};

// Delta로 저장된 contents를 html로 변환
export const deltaToHtml = <T extends DeltaContent>(data: T[]): T[] => {
  return data.map((post) => {
    const deltaOps = parseDeltaContent(post.content);
    if (deltaOps) {
      const deltaToHtmlConverter = new QuillDeltaToHtmlConverter(deltaOps);
      const html = deltaToHtmlConverter.convert();
      return { ...post, content: html };
    }
    return post;
  });
};
