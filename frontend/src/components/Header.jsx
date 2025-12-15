const Header = () => (
<header className="flex items-center justify-between border-b px-6 md:px-10 py-3 bg-white dark:bg-background-dark sticky top-0 z-10">
<div className="flex items-center gap-4 text-[#0d141b] dark:text-slate-50">
<div className="size-6 text-primary">
<svg fill="none" viewBox="0 0 48 48">
<path fill="currentColor" d="M39.475 21.6262C40.358 21.4363..." />
</svg>
</div>
<h2 className="text-lg font-bold tracking-[-0.015em]">SiteMaster</h2>
</div>


<div className="flex items-center gap-4">
<p className="text-sm text-slate-600 dark:text-slate-300 hidden sm:block">Welcome, Alex</p>
<div className="bg-cover rounded-full size-10" style={{ backgroundImage: `url(https://lh3...)` }}></div>
</div>
</header>
);
export default Header;