import {
  BuildingOfficeIcon,
  AcademicCapIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

const solutions = [
  {
    title: "Corporate Events",
    description:
      "Ideal for team meetings, training sessions, and corporate workshops.",
    icon: BuildingOfficeIcon,
  },
  {
    title: "Education",
    description: "Boost classroom engagement, whether in-person or virtual.",
    icon: AcademicCapIcon,
  },
  {
    title: "Conferences",
    description:
      "Deliver interactive experiences during workshops, seminars, and large-scale events.",
    icon: UserGroupIcon,
  },
];
function Solutions() {
  return (
    <div id='solutions' className='py-24 bg-white'>
      <div className='mx-auto max-w-7xl px-6 lg:px-8'>
        <div className='mx-auto max-w-2xl text-center'>
          <h2 className='text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl'>
            Solutions for Every Need
          </h2>
          <p className='mt-6 text-lg leading-8 text-gray-600'>
            Empower your audience with interactive tools designed for any
            scenario.
          </p>
        </div>
        <div className='mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none'>
          <dl className='grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3'>
            {solutions.map((solution) => (
              <div key={solution.title} className='flex flex-col'>
                <dt className='flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900'>
                  <solution.icon
                    className='h-8 w-8 flex-none text-blue-600'
                    aria-hidden='true'
                  />
                  {solution.title}
                </dt>
                <dd className='mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600'>
                  <p className='flex-auto'>{solution.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}

export default Solutions;
