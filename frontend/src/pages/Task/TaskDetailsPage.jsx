import TopNavBar from "../../components/TopNavBar";
import Breadcrumbs from "../../components/Breadcrumbs";
import TaskHeader from "../../components/TaskHeader";
import TaskDescriptionCard from "../../components/TaskDescriptionCard";
import TaskDetailsCard from "../../components/TaskDetailsCard";
import AssignedTeam from "../../components/AssignedTeam";
import ProofOfProgress from "../../components/ProofOfProgress";


export default function TaskDetailsPage() {
return (
<div className="font-display bg-background-light dark:bg-background-dark text-gray-900 dark:text-gray-100 min-h-screen">
<TopNavBar />


<main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
<Breadcrumbs />
<TaskHeader />


<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
<div className="lg:col-span-2 flex flex-col gap-8">
<TaskDescriptionCard />
<TaskDetailsCard />
</div>


<div className="lg:col-span-1 flex flex-col gap-8">
<AssignedTeam />
<ProofOfProgress />


<button className="w-full bg-success text-white font-bold py-3 px-4 rounded-lg hover:bg-success/90 flex items-center justify-center gap-2">
<span className="material-symbols-outlined">check_circle</span>
Complete Task
</button>
</div>
</div>
</main>
</div>
);
}
