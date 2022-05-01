const cluster = require('cluster');
const {cpus} = require('os');
const {exit, pid} = process;

function fibonacci(num) {
    if (num === 0) {
        return 0;
    } else if (num === 1) {
        return 1;
    } else {
        return fibonacci(num - 1) + fibonacci(num - 2);
    }
}

const numCPUs = cpus().length;

if (cluster.isPrimary) {
    let dataStore = [];
    const readyChecker = () => {
        if (dataStore.length === numCPUs) {
            console.log(`🎉 都搞定了，用时：${new Date - start}`);
            exit(0);
        }
    }

    console.log(`🚀 主进程上线 #ID ${pid}`);
    const start = new Date();

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('online', (worker) => {
        console.log(`👷 分发计算任务 #ID ${worker.id}`);
        worker.send(40);
    });

    const messageHandler = function (msg) {
        console.log("📦 收到结果", msg.ret)
        dataStore.push(msg.ret);
        readyChecker()
    }

    for (const id in cluster.workers) {
        cluster.workers[id].on('message', messageHandler);
    }

} else {
    process.on('message', (msg) => {
        process.send({ret: fibonacci(msg)});
    });
}
