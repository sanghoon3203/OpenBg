// FILE: src/services/apiResponseParser.js (새 파일 또는 기존 유틸리티 파일에 추가)

/**
 * Python 리터럴 스타일의 문자열 (단순 리스트/딕셔너리)을 파싱 시도합니다.
 * 예: "{'key': 'value', 'list_str': "['item1', 'item2']"}"
 * 중첩된 문자열화된 리스트/딕셔너리도 재귀적으로 파싱 시도합니다.
 */
function robustParsePythonString(str) {
    if (typeof str !== 'string') return str; // 이미 객체이거나 문자열이 아니면 그대로 반환
  
    let jsonCompatibleStr = str.trim();
  
    // Python True, False, None -> JSON true, false, null
    jsonCompatibleStr = jsonCompatibleStr.replace(/\bTrue\b/g, 'true')
                                       .replace(/\bFalse\b/g, 'false')
                                       .replace(/\bNone\b/g, 'null');
  
    // 주의: 이 부분은 매우 민감하며, 모든 Python 리터럴을 완벽하게 JSON으로 변환하지 못할 수 있습니다.
    // 특히 문자열 내부에 따옴표가 복잡하게 사용된 경우 문제가 될 수 있습니다.
    // 1. 바깥쪽이 딕셔너리/리스트 형태이고 내부 문자열 값에 사용된 따옴표를 보호하며 외부 키/값을 변환 시도
    if ((jsonCompatibleStr.startsWith('{') && jsonCompatibleStr.endsWith('}')) ||
        (jsonCompatibleStr.startsWith('[') && jsonCompatibleStr.endsWith(']'))) {
      
      // 내용을 보호하기 위해 내부 문자열 리터럴("...")을 임시 플레이스홀더로 변경
      const stringLiterals = [];
      jsonCompatibleStr = jsonCompatibleStr.replace(/"((?:\\.|[^"\\])*)"/g, (match) => {
        stringLiterals.push(match);
        return `___STRING_LITERAL_${stringLiterals.length - 1}___`;
      });
  
      // 이제 남은 부분에서 single quote를 double quote로 변경
      jsonCompatibleStr = jsonCompatibleStr.replace(/'/g, '"');
  
      // 플레이스홀더를 원래 문자열 리터럴로 복원
      stringLiterals.forEach((literal, index) => {
        jsonCompatibleStr = jsonCompatibleStr.replace(`___STRING_LITERAL_${index}___`, literal);
      });
    }
  
    try {
      const parsed = JSON.parse(jsonCompatibleStr);
      // 만약 파싱된 결과가 객체나 배열이라면, 그 내부 값들도 재귀적으로 파싱 시도 (중첩된 문자열화된 데이터 처리)
      if (typeof parsed === 'object' && parsed !== null) {
        for (const key in parsed) {
          if (Object.prototype.hasOwnProperty.call(parsed, key) && typeof parsed[key] === 'string') {
            parsed[key] = robustParsePythonString(parsed[key]);
          }
        }
      } else if (typeof parsed === 'string') {
        // JSON.parse 결과가 다시 문자열이면, 한 번 더 파싱 시도 (예: "['a', 'b']" 같은 경우)
        return robustParsePythonString(parsed);
      }
      return parsed;
    } catch (e) {
      // console.warn("robustParsePythonString 파싱 실패:", str, "\n오류:", e);
      return str; // 파싱 실패 시 원본 문자열 반환 (또는 null/에러)
    }
  }
  
  
  export function parseApiOutputString(apiString) {
    const lines = apiString.split('\n').map(line => line.trim());
    const result = {
      user_data: null,
      configured_query: {},
      acquired_badges: [], // 사용자 메타데이터의 acquired_badges와 별개로 API 최상단에 있는 것
      search_results: []
    };
  
    let readingMode = null;
  
    for (const line of lines) {
      if (line.startsWith('✅ 사용자 데이터 발견:')) {
        readingMode = 'userData';
        continue;
      } else if (line.startsWith('🔎 구성된 쿼리:')) {
        readingMode = 'configuredQuery';
        const queryPart = line.substring('🔎 구성된 쿼리:'.length).trim();
        if (queryPart.startsWith('목표:')) {
          result.configured_query['목표'] = queryPart.substring('목표:'.length).trim();
        }
        continue;
      } else if (line.startsWith('🏆 이미 획득한 배지:')) {
        readingMode = null; // 이 섹션은 acquired_badges_from_string으로 이미 처리됨
        const badgesStr = line.substring('🏆 이미 획득한 배지:'.length).trim();
        result.acquired_badges = robustParsePythonString(badgesStr);
        continue;
      } else if (line.startsWith('🎯 검색 결과:')) {
        readingMode = 'searchResults';
        continue;
      } else if (line.startsWith('📂') || line.startsWith('🔑') || line.startsWith('🔍 사용자')) {
        readingMode = null; 
        continue;
      }
  
      if (readingMode === 'userData') {
        if (line.startsWith('- 메타데이터:')) {
          const metaDataString = line.substring('- 메타데이터:'.length).trim();
          result.user_data = robustParsePythonString(metaDataString);
        }
      } else if (readingMode === 'configuredQuery') {
        if (line.startsWith('목표:') && !result.configured_query['목표']) { // 중복 방지
          result.configured_query['목표'] = line.substring('목표:'.length).trim();
        } else if (line.startsWith('기술:')) {
          const skillsStr = line.substring('기술:'.length).trim();
          result.configured_query['기술'] = robustParsePythonString(skillsStr);
        } else if (line.startsWith('역량 수준:')) {
          result.configured_query['역량 수준'] = line.substring('역량 수준:'.length).trim();
        }
      } else if (readingMode === 'searchResults') {
        const match = line.match(/^(\d+)\.\s(B\d+)\s-\s(.+?)\s\(점수:\s([\d\.]+)\)$/);
        if (match) {
          result.search_results.push({
            id: match[2],
            name: match[3].trim(),
            score: parseFloat(match[4]),
            // API 응답에 따라 description, issuer_name 등을 추가하거나 카드에서 기본값 처리
            description: `${match[3].trim()}에 대한 상세 설명입니다.`,
            issuer_name: "추천 시스템" 
          });
        }
      }
    }
    // console.log("파싱된 API 결과:", result);
    return result;
  }