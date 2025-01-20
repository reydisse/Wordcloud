import {
  PencilSquareIcon,
  QrCodeIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

const steps = [
  {
    name: "Create",
    description:
      "Use templates or start from scratch to build interactive slides.",
    icon: PencilSquareIcon,
  },
  {
    name: "Interact",
    description: "Participants join via a QR code or link—no downloads needed.",
    icon: QrCodeIcon,
  },
  {
    name: "Analyze",
    description: "Access detailed reports for insights and improvement.",
    icon: ChartBarIcon,
  },
];

function HowItWorks() {
  return (
    <div className='py-24 bg-blue-50'>
      <div className='mx-auto max-w-7xl px-6 lg:px-8'>
        <div className='mx-auto max-w-2xl text-center'>
          <h2 className='text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl'>
            How It Works
          </h2>
          <p className='mt-6 text-lg leading-8 text-gray-600'>
            Get started in minutes with our intuitive platform.
          </p>
        </div>
        <div className='mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none'>
          <dl className='grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3'>
            {steps.map((step, index) => (
              <div
                key={step.name}
                className='flex flex-col items-center text-center'
              >
                <dt className='flex flex-col items-center gap-y-4'>
                  <div className='rounded-lg bg-blue-600 p-4'>
                    <step.icon
                      className='h-6 w-6 text-white'
                      aria-hidden='true'
                    />
                  </div>
                  <div className='text-base font-semibold leading-7 text-gray-900'>
                    {index + 1}. {step.name}
                  </div>
                </dt>
                <dd className='mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600'>
                  <p className='flex-auto'>{step.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}

export default HowItWorks;
