// ADAPTERS
export {CableAdapter} from './adapters/cable_adapter'
export {AppAdapter} from './adapters/app_adapter'

// MANAGERS

export {DesktopPageManager} from './components/desktop_page/desktop_page_manager'
export {MobilePageManager} from './components/mobile_page/mobile_page_manager'
export {AppManager} from './components/app_manager'
export {GameManager} from './components/game/game_manager'
export {DesktopGameManager} from './components/game/desktop_game_manager'
export {MobileGameManager} from './components/game/mobile_game_manager'
export {LeaderboardManager} from './components/leaderboard/leaderboard_manager'


// GENERATORS
export {GeneralElement} from './components/game/generators/general_element'
export {SpaceshipElement} from './components/game/generators/spaceship_element'
export {BulletElement} from './components/game/generators/bullet_element'
export {CompleteAstroidElement} from './components/game/generators/complete_astroid_element'
export {AstroidPartAElement} from './components/game/generators/astroid_part_a_element'
export {AstroidPartBElement} from './components/game/generators/astroid_part_b_element'
export {AstroidPartCElement} from './components/game/generators/astroid_part_c_element'
export {DeconstructedAstroidGroup} from './components/game/generators/deconstructed_astroid_group'
export {ParticleRockElement} from './components/game/generators/particle_rock_element'
export {ParticleRockDestroyPartGroup} from './components/game/generators/particle_rock_destroy_part_group'
