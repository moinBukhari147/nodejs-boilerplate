export const setupGracefulShutdown = (worker, name) => {
    process.on('uncaughtException', (err) => {
        console.error(`Unhandled exception in ${name}:`, err);
    });

    process.on('SIGINT', async () => {
        console.log(`Shutting down ${name}...`);
        await worker.close();
        console.log(`${name} stopped.`);
        process.exit(0);
    });
};