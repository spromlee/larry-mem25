import Obituary1 from '@/assets/ob2.jpg';
import Obituary2 from '@/assets/ob1.jpg';
import Obituary3 from '@/assets/ob3.jpg';
import Obituary4 from '@/assets/ob4.jpg';
import Obituary5 from '@/assets/ob5.jpg';
import Obituary6 from '@/assets/ob6.jpg';
import Image from 'next/image';

export default function Obituary() {
  const content = [
    {
      text: "Larry Broderick joined his beloved raptors soaring high in the air on December 31. Well-known in the birding community, Larry’s passion was introducing people to hawks and eagles; identifying species and plumage; and exploring habitats. He gave birding books to birding fans who followed him up hills, down to the sea, and across delta islands. The Jenner Headlands, Estero Americano, Lynch Canyon, and Tubbs Island were all on his list of favorite birding locations. But any rural road or fence line would do.",
      image: Obituary1
    },
    {
      text: "Larry was Coordinator & Editor at Bald Eagles of the North Bay and Beyond; Founder, Day Leader, and Co-manager at Jenner Headlands Hawkwatch; Independent Contractor at Solano Land Trust; Independent Contractor at Sonoma Land Trust; Director, Lead Visionary, Interpretive Guide, and Presenter at the West County HawkWatch Raptor Resource Page - Citizen Scientist Group; and a member of Madrone Audubon Society.",
      image: Obituary2
    },
    {
      text: "Larry loved his wife Sameth and their three sons even more than raptors. Larry served as his sons’ Cub Scout leader; was the loudest rooter at basketball and baseball games; and the hardest clapper at plays and concerts. He was proud of each son: 16-year-old Elljay’s theatrical acting and SRHS Track and Field accomplishments; 15-year-old Preston’s baseball, basketball, and Santa Rosa Middle School’s Student Body Presidency; and 12-year-old Tyler’s Little League baseball and marimba playing. He loved his wife Sameth with passion, sharing 18 loving years with her as their family grew.",
      image: Obituary3
    },
    {
      text: "Larry alerted family and neighbors as the Tubbs Fire made its way down from Fountain Grove and stayed behind in a heroic effort to save his family’s and neighbors’ homes. Several weeks after the fire, on his way to work, he observed a runaway debris truck on fire hurtling down the Fountain Grove Expressway and crashing into cars. Again, heroically, he assisted injured people in exiting their burning vehicles.",
     
    },
    {
      text: "Larry’s passion for trains began with visits to his grandparents’ Oregon home overlooking the Southern Pacific Mainline, continued with collections of railroad books and models, and watching YouTube videos. Any train track was an excuse to stop and take a few pictures.",
      image: Obituary4
    },
    {
      text: "Larry was born on December 13, 1965, in San Francisco and passed away at home in Santa Rosa on December 31, 2024, surrounded by his family.",
      
    },
    {
      text: "Larry is also survived by his loving parents, Nancy and Pat Broderick; his mourning sister Laurie and her husband Jim; niece Michaela and her husband Ryan, and grandniece Nora; and his Auntie Kay and Tom. He is also mourned by Sameth’s extended Prom family and his Broderick relatives.",
      image: Obituary5
    },
    {
      text: "Think of Larry when you see a peregrine falcon perched on a fence post or an eagle soaring above the Jenner Headlands. When you attend a Santa Rosa High School Art Quest play, visit a Little League baseball game, or enjoy a Santa Rosa School District Marimba Band Concert, listen for his cheers and applause. His spirit lives on through his children’s lives and his wife’s memories.",
      image: Obituary6
    },
    {
      text: "Larry’s love of birds can also live on with a memorial contribution to any of the above raptor agencies or a bird support group of your choice.",
    },
    {
      text: "A Celebration of Larry’s Life is scheduled for 11:00 a.m., Sunday, February 23, at the Hidden Valley Elementary School Multi-purpose Room.",
    }
  ];

  return (
    <section
      id="obituary"
      className="pt-10 pb-16 bg-white font-roboto-condensed"
    >
      <div className="container mx-auto px-4 flex flex-col justify-center w-full">
        <h2 className="text-3xl font-roboto-condensed mb-1">Obituary</h2>
        <div className="h-1 w-[70px] bg-primary mb-8"></div>
        <div className="lg:text-lg text-base font-inter w-full">
          {content.map((item, index) => (
            <div key={index}>
              <p className="mb-0">{item.text}</p>
              {item.image && (
                <div className='flex justify-center items-center'>
                  <div className="my-5 max-w-[600px] h-full rounded-xl overflow-hidden shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] p-1.5">
                    <Image
                      src={item.image}
                      alt={`Obituary image ${index + 1}`}
                      className="object-contain rounded-lg"
                      width={1200}
                      height={600}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}