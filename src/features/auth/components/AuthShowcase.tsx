import { Link } from 'react-router-dom';
import { FiActivity, FiShield } from 'react-icons/fi';
import Logo from '@assets/logo.png';
import AuthPatientImage from '@assets/AuthPatientImage.webp';

/**
 * Brand panel for the auth screens (lg and up only).
 * `hidden` below lg means display:none, so the lazy-loaded photo is never downloaded on phones/tablets.
 * The panel stays one viewport tall (sticky) even if the form column scrolls.
 */
function AuthShowcase() {
    return (
        <aside className="hidden p-4 lg:sticky lg:top-0 lg:block lg:h-dvh lg:self-start">
            <div className="relative h-full overflow-hidden rounded-3xl bg-primary-950">
                {/* Photo fills the whole panel */}
                <img
                    src={AuthPatientImage}
                    alt=""
                    width={640}
                    height={640}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover object-center"
                />

                {/* Scrims keep the white text readable over the photo */}
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" aria-hidden="true" />
                <div className="absolute inset-x-0 top-0 h-32 bg-linear-to-b from-black/40 to-transparent" aria-hidden="true" />

                {/* Small accents on the panel edge (absolute, so they never affect layout) */}
                <div className="absolute right-10 top-28 flex items-center gap-2 animate-float-slow motion-reduce:animate-none" aria-hidden="true">
                    <span className="h-0.5 w-9 rounded-full bg-white/80" />
                    <span className="grid h-12 w-12 place-items-center rounded-xl bg-white shadow-lg shadow-black/20">
                        <FiActivity className="h-5 w-5 text-primary-500" />
                    </span>
                </div>
                <div className="absolute right-10 top-[58%] flex items-center gap-2 animate-float-medium motion-reduce:animate-none" aria-hidden="true">
                    <span className="h-0.5 w-9 rounded-full bg-white/80" />
                    <span className="grid h-12 w-12 place-items-center rounded-xl bg-secondary-500 font-archivo text-base font-bold text-white shadow-lg shadow-black/20">
                        24
                    </span>
                </div>

                {/* Content */}
                <div className="relative z-10 flex h-full flex-col justify-between p-10 text-white">
                    <Link to="/" className="inline-flex w-fit items-center gap-3" aria-label="Likita24 home">
                        <img src={Logo} alt="" className="h-10 w-10" />
                        <span className="font-archivo text-xl font-bold tracking-tight text-white">Likita24</span>
                    </Link>

                    <div>
                        <h2 className="font-archivo text-4xl xl:text-[2.75rem] font-bold leading-[1.1] tracking-tight text-white">
                            Quality healthcare<br />at your fingertips
                        </h2>
                        <p className="mt-4 flex items-center gap-2 font-poppins text-sm text-white/85">
                            <FiShield className="h-4 w-4" aria-hidden="true" />
                            Verified doctors · Secure consultations
                        </p>
                    </div>
                </div>
            </div>
        </aside>
    );
}

export default AuthShowcase;
