export default (to) => {
    return new Promise((resolve) => {
        const scrollTo = to.matched.find((m) => m.meta?.scrollTo)?.meta.scrollTo;

        if (scrollTo) {
            setTimeout(() => {
                SmoothScroll(scrollTo, 'top');
            }, 500);
        }

        resolve();
    });
};