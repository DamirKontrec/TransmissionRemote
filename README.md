## Transmission remote

A proof of concept web remote client for[ Transmission BitTorrent client](https://transmissionbt.com/), optimized for mobile devices. 

Created long ago (back) in 2013, using:
- [jQuery](https://jquery.com/) (for basic DOM abstraction)
- [HammerJS](https://hammerjs.github.io/) (for touch interactions)
- [MomentJS](https://momentjs.com/) (for user-friendly time descriptions)
- [QuoJS](https://www.drupal.org/project/quojs) (for advanced touch events)

Since this app is getting a bit long in the tooth, I plan on rewriting it in a modern JS framework, and implement missing features (such as search, proper torrent deletion, etc.).

Example of the app in action:

![Video demo](https://github.com/DamirKontrec/TransmissionRemote/raw/master/demo.gif)

### Usage instructions

Put the cloned resources in your Transmission instalation folder, inside the `web` subfolder, and enable remote client in the app itself.