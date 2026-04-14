export const NotFoundPage = (): JSX.Element => {
    return (
        <section className="mx-auto flex min-h-[60vh] w-full max-w-4xl flex-col items-start justify-center gap-6 px-5 py-20 sm:px-6 lg:px-12">
            <p className="font-inter-tight text-sm font-semibold uppercase tracking-[0.2em] text-[#F26522]">
                Route not found
            </p>
            <h1 className="max-w-3xl text-[clamp(2.8rem,6vw,5rem)] leading-[0.96] text-[#111827]">
                This Originae page is not part of the current static rollout.
            </h1>
            <p className="max-w-2xl font-['DM_Sans',Helvetica] text-lg leading-8 text-[#52525b]">
                The pass-1 deployment only ships the main landing page plus the curated
                <span className="font-semibold text-[#111827]"> /insights </span>
                archive. Return to the site shell or browse the current editorial index.
            </p>
            <div className="flex flex-wrap gap-3">
                <a
                    href="/"
                    className="rounded-full bg-[#18181B] px-5 py-3 font-inter-tight text-sm font-semibold text-white transition-colors hover:bg-[#0f0f0f]"
                >
                    Back to home
                </a>
                <a
                    href="/insights"
                    className="rounded-full border border-[#18181B]/10 px-5 py-3 font-inter-tight text-sm font-semibold text-[#18181B] transition-colors hover:border-[#18181B] hover:bg-[#18181B] hover:text-white"
                >
                    Browse insights
                </a>
            </div>
        </section>
    );
};
