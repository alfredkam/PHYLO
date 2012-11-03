<?php

// Licensed under these terms:
// http://www.opensource.org/licenses/bsd-license.php
// (c) David Renty

require_once(dirname(__FILE__).'/../vendors/Mustache.php');

class MustacheApplicationComponent extends CApplicationComponent {
	private $m;
	private $templateCache = array ();
	public $templatePathAlias = 'application.templates';
	public $templateExtension = 'mustache';
	public $extension = true;
	
	public function init()
	{
		$this->m = new Mustache;
	}

	public function render($templateName, $view=null, $partialNames=null, $options=null)
	{
		$partials = null;

		if ($partialNames != null)
			$partials = $this->getTemplates($partialNames);
		
		echo $this->m->render($this->getTemplate($templateName), $view, $partials, $options);
	}
	
	public function getTemplates($templateNames)
	{
		$templates = array ();

		foreach ($templateNames as $templateName) {
			$templates[$templateName] = $this->getTemplate($templateName);
		}
		
		return $templates;
	}
	
	public function getTemplate($templateName)
	{
		if (array_key_exists($templateName, $this->templateCache)) {
			$template = $this->templateCache[$templateName];
		} else {
			$template = file_get_contents(Yii::getPathOfAlias($this->templatePathAlias) .
				'/' . $templateName . '.' . $this->templateExtension);
			/* Yii mustache extension
			 * %%controller/action%%
			 * %%%relativePath%%%
			 */
			if ($this->extension) {
				$template = preg_replace('/%%%(.+)%%%/e', "Yii::app()->request->baseUrl . '/$1'", $template);
				$template = preg_replace('/%%(\w+\/\w+)%%/e', "Yii::app()->createUrl('$1')", $template);
			}
			$this->templateCache[$templateName] = $template;
		}
		
		return $template;
	}
}
