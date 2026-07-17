// 모든 기존 공지사항에 views 필드 추가하는 스크립트
const https = require('https');

const projectId = 'maple-hub-e1e33';
const apiKey = 'AIzaSyAAG_16Fv-nyVZ3a2P2mi69Zh84IvoXFCQ';

// 1. 모든 공지사항 가져오기
function getAllNotices() {
  return new Promise((resolve, reject) => {
    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/notices?key=${apiKey}`;

    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json.documents || []);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

// 2. 공지사항에 views 필드 추가
function addViewsField(docPath) {
  return new Promise((resolve, reject) => {
    const url = `https://firestore.googleapis.com/v1/${docPath}?updateMask.fieldPaths=views&key=${apiKey}`;

    const postData = JSON.stringify({
      fields: {
        views: {
          integerValue: "0"
        }
      }
    });

    const options = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': postData.length
      }
    };

    const urlObj = new URL(url);
    options.hostname = urlObj.hostname;
    options.path = urlObj.pathname + urlObj.search;

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(data);
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

// 실행
async function main() {
  try {
    console.log('공지사항 불러오는 중...');
    const notices = await getAllNotices();
    console.log(`총 ${notices.length}개의 공지사항 발견`);

    let fixedCount = 0;

    for (const notice of notices) {
      const docId = notice.name.split('/').pop();
      const hasViews = notice.fields && notice.fields.views;

      if (!hasViews) {
        console.log(`  ⚠️  views 필드 없음: ${docId}`);
        console.log(`      제목: ${notice.fields?.title?.stringValue || '(제목 없음)'}`);

        try {
          await addViewsField(notice.name);
          console.log(`  ✅ views: 0 추가 완료!`);
          fixedCount++;
        } catch (error) {
          console.log(`  ❌ 실패: ${error.message}`);
        }
      } else {
        console.log(`  ✓  이미 views 필드 있음: ${docId}`);
      }
    }

    console.log('\n=== 완료 ===');
    console.log(`수정된 공지사항: ${fixedCount}개`);
    console.log(`총 공지사항: ${notices.length}개`);
  } catch (error) {
    console.error('오류 발생:', error);
  }
}

main();
