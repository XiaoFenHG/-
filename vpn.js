const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const readline = require('readline');

// 设置终端输入输出
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// 获取用户输入的函数
function askQuestion(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

// 创建VPN配置文件
function createVpnConfig(serverIp, configFileContent) {
    const configFilePath = path.join(__dirname, 'vpn-config.ovpn');
    const vpnConfig = configFileContent.replace('YOUR_VPN_SERVER_IP', serverIp);
    fs.writeFileSync(configFilePath, vpnConfig);
    return configFilePath;
}

// 启动VPN连接
function startVpn(configFilePath, callback) {
    const command = `sudo openvpn --config ${configFilePath}`;
    exec(command, (error, stdout, stderr) => {
        if (error) {
            callback(`执行错误: ${error}`);
            return;
        }
        callback(`VPN已连接\nstdout: ${stdout}\nstderr: ${stderr}`);
    });
}

// 主函数
async function main() {
    console.log("欢迎使用VPN配置工具！\n请按照提示输入信息：");

    const operator = await askQuestion('请输入VPN维持运营商API: ');
    const serverIp = await askQuestion('请输入服务器IP地址: ');
    const configFileContent = await askQuestion('请输入VPN配置文件内容: ');

    const configFilePath = createVpnConfig(serverIp, configFileContent);

    console.log(`\nVPN维持运营商API: ${operator}`);
    console.log(`VPN配置文件路径: ${configFilePath}`);

    startVpn(configFilePath, (message) => {
        console.log(message);
        rl.close();
    });
}

main();
