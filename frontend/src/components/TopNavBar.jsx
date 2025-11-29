export default function TopNavBar() {
return (
<header className="sticky top-0 z-10 w-full bg-white dark:bg-gray-800/50 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
<div className="flex items-center gap-3 text-gray-800 dark:text-gray-100">
<div className="size-6 text-primary">
<svg fill="currentColor" viewBox="0 0 48 48"><path d="M39.5563 34.1455V13.8546C39.5563 15.708 36.8773 17.3437 32.7927 18.3189..."/></svg>
</div>
<h2 className="text-lg font-bold">ConstructPro</h2>
</div>


<div className="flex items-center gap-4">
<button className="h-10 w-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
<span className="material-symbols-outlined text-xl">notifications</span>
</button>
<div className="size-10 rounded-full bg-cover bg-center" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/...')"}}></div>
</div>
</div>
</header>
);
}