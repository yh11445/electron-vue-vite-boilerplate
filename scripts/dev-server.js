const { createServer } = require('vite'); // Vite의 서버 생성 함수
const { spawn, exec } = require('child_process'); // 프로세스 생성 및 실행 함수
const path = require('path');
const chalk = require('chalk');
const { watch } = require('chokidar'); // 파일 변경 감시 함수
const electron = require('electron'); // Electron 모듈
const { EOL } = require('os');

let viteServer = null;
let electronProcess = null;
let electronProcessLocker = false;
let rendererPort = 0;

// Renderer를 빌드하고 dev server를 시작하는 함수
async function startRenderer() {
  viteServer = await createServer({
    configFile: path.join(__dirname, '..', 'vite.config.ts'),
    mode: 'development',
  });

  return viteServer.listen();
}

// Electron을 시작하는 함수
async function startElectron() {
  if (electronProcess) {
    // 단일 인스턴스 락
    return;
  }

  // Electron 프로세스 시작
  const args = [
    path.join(__dirname, '..', 'build', 'electron', 'main.js'),
    String(rendererPort), // 포트를 문자열로 전달
  ];

  electronProcess = spawn(electron, args);
  electronProcessLocker = false;

  // Electron 로그 관리
  if (electronProcess.stdout) {
    electronProcess.stdout.on('data', (data) => {
      if (data.toString() === EOL) {
        return;
      }

      process.stdout.write(
        chalk.blueBright(`[electron] `) + chalk.white(data.toString())
      );
    });
  }

  // stderr 로그 관리
  if (electronProcess.stderr) {
    electronProcess.stderr.on('data', (data) => {
      process.stderr.write(
        chalk.blueBright(`[electron] `) + chalk.white(data.toString())
      );
    });
  }

  electronProcess.on('exit', () => stop());
}

// Electron을 재시작하는 함수
function restartElectron() {
  if (electronProcess) {
    electronProcess.removeAllListeners('exit');
    electronProcess.kill();
    electronProcess = null;
  }

  if (!electronProcessLocker) {
    electronProcessLocker = true;
    startElectron();
  }
}

// 종료하는 함수
function stop() {
  if (viteServer) viteServer.close();
  process.exit();
}

// 개발 서버와 Electron을 시작하는 함수
async function start() {
  console.log(`${chalk.greenBright('=======================================')}`);
  console.log(`${chalk.greenBright('Starting Electron + Vite Dev Server...')}`);
  console.log();

  const devServer = await startRenderer();
  rendererPort = devServer.config.server.port || 8080;

  console.log(`${chalk.greenBright('rendererPort:', rendererPort)}`);
  console.log(`${chalk.greenBright('=======================================')}`);

  // rendererPort가 제대로 설정된 후에만 Electron을 시작
  if (rendererPort > 0) {
    startElectron();
  } else {
    console.error('Failed to retrieve a valid renderer port.');
  }

  // Electron 메인 프로세스(TypeScript 파일)의 변경을 감시
  const mainPath = path.join(__dirname, '..', 'src', 'electron');
  watch(mainPath, {
    cwd: mainPath,
  }).on('change', (changedPath) => {
    console.log(
      chalk.blueBright(`[electron] `) + `Change in ${changedPath}. Recompiling...`
    );

    // 메인 프로세스의 TypeScript 재컴파일
    exec('tsc --build', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error during main process compilation: ${error.message}`);
        return;
      }

      if (stderr) {
        console.error(`Compilation stderr: ${stderr}`);
        return;
      }

      console.log(`Main process recompiled: ${stdout}`);

      // 컴파일 완료 후 Electron 재시작
      restartElectron();
    });
  });

  // 렌더러 프로세스(Vue/TS 파일)의 변경을 감시
  const rendererPath = path.join(__dirname, '..', 'src', 'renderer');
  watch(rendererPath, {
    cwd: rendererPath,
  }).on('change', (changedPath) => {
    console.log(
      chalk.blueBright(`[vite] `) + `Change in ${changedPath}. Restarting Electron...`
    );

    // 렌더러 파일 수정 시 Electron 재시작
    restartElectron();
  });
}

start();