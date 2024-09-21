export const mockApi = () =>
    new Promise<void>((resolve, reject) => {
        setTimeout(() => {
            const x = Math.random() * 10
            if (x < 5) {
                return resolve()
            }
            reject()
        }, 1000)
    })
