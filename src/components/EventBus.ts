class EventBus {
    private listeners: { [event: string]: Function[] } = {};

    on(event: string, callback: Function) {
        console.log('on')

        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }

    emit(event: string, data: any) {
        //console.log('emit ', data)
        if (this.listeners[event]) {
            this.listeners[event].forEach((callback) => {
                callback(data);
            });
        }
    }
}

export const eventBus = new EventBus();
