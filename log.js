const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJjaGV0YW4wMzE3LmJlMjNAY2hpdGthcmEuZWR1LmluIiwiZXhwIjoxNzc3OTU5ODIxLCJpYXQiOjE3Nzc5NTg5MjEsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiJlZWM2NTNjNy02NTRmLTQzMTEtYWMwMC0wOGU1NDlhNTYzMmEiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJjaGV0YW4gYmFuc2FsIiwic3ViIjoiZTNiZDZkZTgtYjU2NS00MTJjLTljZTMtMWViMzEyOGNkZmM5In0sImVtYWlsIjoiY2hldGFuMDMxNy5iZTIzQGNoaXRrYXJhLmVkdS5pbiIsIm5hbWUiOiJjaGV0YW4gYmFuc2FsIiwicm9sbE5vIjoiMjMxMDk5MDMxNyIsImFjY2Vzc0NvZGUiOiJFWGZ2RHAiLCJjbGllbnRJRCI6ImUzYmQ2ZGU4LWI1NjUtNDEyYy05Y2UzLTFlYjMxMjhjZGZjOSIsImNsaWVudFNlY3JldCI6InB1ZnR3VkNrYURjSERYdEUifQ.qnkBLwXIrmlLsLmyopg0I8e9sHjzxkO_55UvZW4nM6I";

async function log(stack, level, pkg, message) {
    const url = "http://20.207.122.201/evaluation-service/logs";
    try {
        await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                stack: stack.toLowerCase(),
                level: level.toLowerCase(),
                package: pkg.toLowerCase(),
                message: message
            })
        });
    } catch (error) {
        console.error("Logging failed:", error.message);
    }
}

module.exports = log;