// @ts-check

// require
// node standard library에 있는 모델은 절대경로 사용
// 프로젝트 내 node module 폴더
// 절대경로 지정 -> module.paths 경로를 순서대로 검사해서 해당 모듈이 있으면 첫 번째 것을 가져옴
const { path, paths, filename } = module

console.log({
  path,
  paths,
  filename,
})

// CommonJS: require
//
