import { Assertions } from '@ephox/agar';
import { Chain } from '@ephox/agar';
import { Pipeline } from '@ephox/agar';
import { UiFinder } from '@ephox/agar';
import { TinyDom } from '@ephox/mcagar';
import { TinyLoader } from '@ephox/mcagar';
import { TinyUi } from '@ephox/mcagar';
import { Html } from '@ephox/sugar';
import HelpPlugin from 'tinymce/plugins/help/Plugin';
import FakePlugin from '../module/test/FakePlugin';
import NoMetaFakePlugin from '../module/test/NoMetaFakePlugin';
import ModernTheme from 'tinymce/themes/modern/Theme';
import { UnitTest } from '@ephox/bedrock';

UnitTest.asynctest('Browser Test: .MetadataTest', function () {
  const success = arguments[arguments.length - 2];
  const failure = arguments[arguments.length - 1];

  ModernTheme();
  HelpPlugin();
  FakePlugin();
  NoMetaFakePlugin();

  const sAssertPluginList = function (html) {
    return Chain.asStep(TinyDom.fromDom(document.body), [
      UiFinder.cWaitFor('Could not find notification', 'div.mce-floatpanel ul'),
      Chain.mapper(Html.get),
      Assertions.cAssertHtml('Plugin list html does not match', html)
    ]);
  };

  TinyLoader.setup(function (editor, onSuccess, onFailure) {
    const tinyUi = TinyUi(editor);
    Pipeline.async({}, [
      tinyUi.sClickOnToolbar('click on help button', 'button'),
      sAssertPluginList(
        '<li><a href="https://www.tinymce.com/docs/plugins/help" target="_blank" rel="noopener">Help</a></li>' +
        '<li><a href="http://www.fake.com" target="_blank" rel="noopener">Fake</a></li>' +
        '<li>nometafake</li>'
      )
    ], onSuccess, onFailure);
  }, {
    plugins: 'help fake nometafake',
    toolbar: 'help',
    skin_url: '/project/js/tinymce/skins/lightgray'
  }, success, failure);
});
